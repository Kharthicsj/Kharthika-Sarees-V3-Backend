import express from 'express'
import SignupController from '../controller/public/Signup.js';
import LoginController from '../controller/public/Login.js';
import accountDetails from '../controller/public/AccountDeatils.js';
import authToken from '../middleware/authToken.js';
import Logout from '../controller/public/Logout.js';
import Allusers from '../controller/admin-panel/Allusers.js';
import UpladProduct from '../controller/admin-panel/UploadProduct.js';
import fetchProducts from '../controller/admin-panel/fetchProduct.js';
import EditProduct from '../controller/admin-panel/EditProduct.js';
import productCategory from '../controller/public/productFabric.js';
import deleteImage from '../controller/admin-panel/deleteImageCloud.js';
import deleteProduct from '../controller/admin-panel/deleteProduct.js';
import dashboardData from '../controller/admin-panel/dashboard.js';
import deleteUser from '../controller/admin-panel/deleteUser.js';
import getFeaturedProducts from '../controller/public/FeaturedProducts.js';
import getSareeSlider from '../controller/public/SareeSlider.js';
import getChudiSlider from '../controller/public/ChuditharSlider.js';
import getProductDetails from '../controller/public/getProductDetails.js';
import addToCart from '../controller/public/addToCartController.js';
import removeFromCart from '../controller/public/removeFromCart.js';
import getCartItems from '../controller/public/getCartItem.js';
import countCart from '../controller/public/countCart.js';
import addToWishList from '../controller/public/addTowishList.js';
import getWishListItems from '../controller/public/getWishlistItems.js';
import countWishlist from '../controller/public/countWishList.js';
import removeWishListProduct from '../controller/public/removeFromWishlist.js';
import updateCart from '../controller/public/updateCart.js';
import searchProduct from '../controller/public/searchProducts.js';
import UploadBannerImg from '../controller/admin-panel/UploadBannerImg.js';
import fetchBannerImages from '../controller/admin-panel/fetchBannerImages.js';
import deleteBanner from '../controller/admin-panel/deleteBanner.js';
import updateAccountDetails from '../controller/public/updateAccountDetails.js';
import addNewAddress from '../controller/public/addNewAddress.js';
import deleteAddress from '../controller/public/deleteAddress.js';
import updateProfilePic from '../controller/public/updateProfilePic.js';
import editAddress from '../controller/public/editAddress.js';
import paymentController from '../controller/public/payment.js';
import newOrder from '../controller/public/orderInsert.js';
import fetchOrder from '../controller/public/fetchOrders.js';
import fetchAllOrders from '../controller/admin-panel/fetchAllOrders.js';
import updateOrder from '../controller/admin-panel/updateOrder.js';
import editBanner from '../controller/admin-panel/BannerEdit.js';
import cancelOrderController from '../controller/public/CancelOrderController.js';
import otpController from '../controller/public/otpController.js';
import ForgotPasswordOTPController from '../controller/public/forgotPasswordOTPController.js';
import resetPassword from '../controller/public/resetPassword.js';

const router = express.Router()

router.get("/", (req, res) => {
    res.send("Hello World")
});

//Public Requests
router.post("/signup",SignupController)
router.post("/login",LoginController)
router.get("/account-details", authToken, accountDetails)
router.post("/update-account-details", authToken, updateAccountDetails)
router.get("/logout", Logout)
router.post("/reset-password", resetPassword)

router.post("/otp", otpController)
router.post("/forgot-password-otp", ForgotPasswordOTPController)

router.post("/add-new-address", authToken, addNewAddress)
router.post("/delete-address", authToken, deleteAddress)
router.post("/update-profile-pic", authToken, updateProfilePic)
router.post("/update-address", authToken, editAddress)

router.get("/fetchby-category", productCategory)
router.get("/featured-products", getFeaturedProducts)
router.get("/saree-slider", getSareeSlider)
router.get("/chudithar-slider", getChudiSlider)
router.post("/getProductDetails", getProductDetails)
router.get("/search-product", searchProduct)

router.post("/add-to-cart", authToken, addToCart)
router.post("/remove-from-cart", authToken, removeFromCart)
router.get("/fetch-cart", authToken, getCartItems)
router.get("/count-cart", authToken, countCart)
router.post("/update-cart", authToken, updateCart)

router.post("/add-to-wishlist", authToken, addToWishList)
router.post("/remove-from-wishlist", authToken, removeWishListProduct)
router.get("/fetch-wishlist", authToken, getWishListItems)
router.get("/count-wishlist", authToken, countWishlist)

router.post("/payment", paymentController)

router.post("/new-order", authToken, newOrder)
router.get("/my-orders", authToken, fetchOrder)
router.post("/cancel-order", authToken, cancelOrderController)

//Admin-panel Requests
router.get("/all-users", Allusers);
router.post("/product-upload", authToken , UpladProduct)
router.get("/product-fetch", fetchProducts)
router.post("/update-product", authToken, EditProduct)
router.post("/delete-image", deleteImage)
router.post("/delete-product", authToken , deleteProduct)
router.get("/dashboard-data", dashboardData)
router.post("/delete-user", authToken, deleteUser)
router.post("/upload-banner", authToken, UploadBannerImg)
router.post("/edit-banner", authToken, editBanner)
router.get("/fetch-banner", fetchBannerImages)
router.delete("/delete-banner/:id", deleteBanner)
router.get("/all-orders", fetchAllOrders)
router.post("/update-order", updateOrder)

export default router