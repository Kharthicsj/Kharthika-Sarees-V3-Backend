import axios from "axios";
import crypto from "crypto";

async function paymentController(req, res) {
    try {
        console.log(req.body);
        const { name, amount, number, MID, transactionId } = req.body;

        const data = {
            merchantId: process.env.MERCHANT_ID,
            merchantTransactionId: transactionId,
            merchantUserId: MID,
            name: name,
            amount: amount,
            redirectUrl: `https://kharthikasarees.com/order-successful?transactionId=${transactionId}`,
            redirectMode: "GET",
            mobileNumber: number,
            paymentInstrument: {
                type: "PAY_PAGE",
            },
        };

        const payload = JSON.stringify(data);
        const payloadMain = Buffer.from(payload).toString("base64");
        const keyIndex = 1;
        const string = payloadMain + "/pg/v1/pay" + process.env.SALT_KEY;
        const sha256 = crypto.createHash("sha256").update(string).digest("hex");
        const checksum = sha256 + "###" + keyIndex;

        console.log("CheckSum : " + checksum);
        console.log("payload : " + payload);
        console.log("payload main : " + payloadMain);

        const prod_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay";

        const options = {
            method: "post",
            url: prod_URL,
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                "X-VERIFY": checksum,
            },
            data: {
                request: payloadMain,
            },
        };

        // Make the request to PhonePe API from your backend
        axios
            .request(options)
            .then(function (response) {
                // Send the redirect URL to the frontend
                console.log(response.data);
                res.json({
                    redirectUrl: response.data.data.instrumentResponse.redirectInfo.url,
                });
            })
            .catch(function (error) {
                console.error(error);
                res.status(500).send({ message: error.message, success: false });
            });
    } catch (error) {
        res.status(500).send({ message: error.message, success: false });
    }
}

export default paymentController