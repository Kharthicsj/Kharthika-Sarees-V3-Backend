import userModel from "../../models/User.js";
import productModel from "../../models/ProductModel.js";
import orderModel from "../../models/OrderModel.js";

async function dashboardData(req, res) {
    try {
        // Get the year from query params, default to current year if not provided
        const { year } = req.query;
        const currentYear = year || new Date().getFullYear();

        // Fetch total counts for users and products
        const userCount = await userModel.countDocuments();
        const productsCount = await productModel.countDocuments();
        const outOfStockCount = await productModel.countDocuments({ quantity: { $eq: 0 } });
        const inStock = await productModel.countDocuments({ quantity: { $gte: 1 } });

        // Fetch distinct fabrics available in products
        const productFabrics = await productModel.distinct("fabric");
        const productCountByFabric = {};

        // Loop through each fabric type
        for (const fabric of productFabrics) {
            const sareeCount = await productModel.countDocuments({ fabric, category: "Saree" });
            const chuditharCount = await productModel.countDocuments({ fabric, category: "Chudithar" });
            productCountByFabric[fabric] = { Saree: sareeCount, Chudithar: chuditharCount };
        }

        // Fetch distinct categories available in products
        const productCategory = await productModel.distinct("category");
        const productCountByCategory = {};

        // Loop through each category to get product counts
        for (const category of productCategory) {
            const categoryCount = await productModel.countDocuments({ category });
            productCountByCategory[category] = categoryCount;
        }

        // Fetch orders and group by status
        const orderStatusCounts = {
            pending: await orderModel.countDocuments({ orderStatus: "Pending" }),
            shipped: await orderModel.countDocuments({ orderStatus: "Shipped" }),
            outForDelivery: await orderModel.countDocuments({ orderStatus: "Out for Delivery" }),
            delivered: await orderModel.countDocuments({ orderStatus: "Delivered" }),
            cancelled: await orderModel.countDocuments({ orderStatus: "Cancelled" }),
        };

        const totalOrders = await orderModel.countDocuments();

        // Fetch daily sales data
        const dailySales = await orderModel.aggregate([
            {
                $match: {
                    createdAt: { $exists: true }, // Use the createdAt field for timestamps
                    total: { $exists: true, $ne: null } // Ensure total exists and is not null
                }
            },
            {
                $project: {
                    orderDate: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, // Format createdAt to YYYY-MM-DD
                    total: { $toDouble: "$total" } // Convert total to numeric type
                }
            },
            {
                $group: {
                    _id: "$orderDate", // Group by formatted date
                    totalSales: { $sum: "$total" } // Sum up totals for the day
                }
            },
            {
                $sort: { _id: 1 } // Sort by date in ascending order
            }
        ]);

        // Map daily sales data to a more readable format
        const salesData = dailySales.map(sale => ({
            date: sale._id, // The date in YYYY-MM-DD format
            totalAmount: sale.totalSales // Total sales amount for that date
        }));

        // Fetch month-wise orders count for the selected year
        const monthlyOrderCount = await orderModel.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(`${currentYear}-01-01`),
                        $lt: new Date(`${Number(currentYear) + 1}-01-01`)
                    }
                }
            },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    year: { $year: "$createdAt" },
                }
            },
            {
                $group: {
                    _id: { year: "$year", month: "$month" },
                    orderCount: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.month": 1 }
            }
        ]);

        // Format the monthly order count for chart
        const ordersTrackingData = Array(12).fill(0);

        monthlyOrderCount.forEach(order => {
            const month = order._id.month - 1; // Convert month to 0-indexed (Jan=0, Feb=1, etc.)
            ordersTrackingData[month] = order.orderCount; // Set the count for the corresponding month
        });

        // Fetch month-wise sales data for the selected year
        const monthlySalesData = await orderModel.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(`${currentYear}-01-01`),
                        $lt: new Date(`${Number(currentYear) + 1}-01-01`)
                    },
                    total: { $exists: true, $ne: null }
                }
            },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    year: { $year: "$createdAt" },
                    total: { $toDouble: "$total" }
                }
            },
            {
                $group: {
                    _id: { year: "$year", month: "$month" },
                    totalSales: { $sum: "$total" }
                }
            },
            {
                $sort: { "_id.month": 1 }
            }
        ]);

        // Format the monthly sales data for chart
        const profitTrackingData = Array(12).fill(0);

        monthlySalesData.forEach(sale => {
            const month = sale._id.month - 1;
            profitTrackingData[month] = sale.totalSales;
        });


        // Find the top 3 best-selling products
        const topSellingProductIds = await orderModel.aggregate([
            { $unwind: "$product" },
            {
                $group: {
                    _id: "$product._id", 
                    totalSold: { $sum: "$product.quantity" }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 3 } 
        ]);
        
        const topSellingProducts = await productModel.find({
            _id: { $in: topSellingProductIds.map(item => item._id) } 
        });
        
        const topSellingWithCount = topSellingProducts.map(product => {
            const soldData = topSellingProductIds.find(item => String(item._id) === String(product._id));
            return {
                ...product.toObject(),
                totalSold: soldData ? soldData.totalSold : 0
            };
        });

        // Return the data in the response
        return res.status(200).json({
            success: true,
            error: false,
            message: "Dashboard data fetched successfully",
            data: {
                userCount,
                productsCount,
                productCountByFabric,
                productCountByCategory,
                outOfStockCount,
                inStock,
                totalOrders,
                orderStatusCounts,
                dailySales: salesData,
                monthlyOrderCount: ordersTrackingData,
                monthlySalesData: profitTrackingData,
                topSellingProducts: topSellingWithCount,
            },
        });

    } catch (err) {
        console.error("Error while processing request:", err);
        return res.status(500).json({
            error: true,
            success: false,
            message: "Error while processing request",
            details: err.message,
        });
    }
}

export default dashboardData;
