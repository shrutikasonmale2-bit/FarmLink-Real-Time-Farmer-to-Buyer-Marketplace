// =====================================================
// FARMLINK - COMPLETE FIREBASE APPLICATION
// =====================================================


// =====================================================
// FIREBASE IMPORTS
// =====================================================

import {

    initializeApp

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {

    getAuth,

    createUserWithEmailAndPassword,

    signInWithEmailAndPassword,

    signOut,

    onAuthStateChanged,

    updateProfile

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {
    getDatabase,
    ref,
    push,
    set,
    onValue,
    remove
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


// =====================================================
// FIREBASE CONFIG
// =====================================================

const firebaseConfig = {

    apiKey:
        "AIzaSyAZK5M_l0d1XbQeuRJs7GhJmhX92DgPP7g",

    authDomain:
        "farmlink-acaaf.firebaseapp.com",

    databaseURL:
        "https://farmlink-acaaf-default-rtdb.firebaseio.com",

    projectId:
        "farmlink-acaaf",

    storageBucket:
        "farmlink-acaaf.firebasestorage.app",

    messagingSenderId:
        "901530301330",

    appId:
        "1:901530301330:web:2262617e7b513c42de874b"

};


// =====================================================
// INITIALIZE FIREBASE
// =====================================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const database = getDatabase(app);


// =====================================================
// GLOBAL VARIABLES
// =====================================================

let currentUser = null;

let allProducts = [];

let selectedProduct = null;


// =====================================================
// HELPER
// =====================================================

function getElement(id) {

    return document.getElementById(id);

}


function showMessage(message, type = "success") {

    let messageBox =
        getElement("messageBox");


    if (!messageBox) {

        messageBox =
            document.createElement("div");

        messageBox.id =
            "messageBox";


        messageBox.style.position =
            "fixed";

        messageBox.style.top =
            "90px";

        messageBox.style.right =
            "20px";

        messageBox.style.padding =
            "15px 22px";

        messageBox.style.borderRadius =
            "10px";

        messageBox.style.color =
            "white";

        messageBox.style.fontWeight =
            "bold";

        messageBox.style.zIndex =
            "9999";


        document.body.appendChild(
            messageBox
        );

    }


    messageBox.textContent =
        message;


    messageBox.style.background =
        type === "success"
            ? "#16a34a"
            : "#dc2626";


    messageBox.style.display =
        "block";


    setTimeout(() => {

        messageBox.style.display =
            "none";

    }, 3000);

}


// =====================================================
// AUTH STATE
// =====================================================

onAuthStateChanged(

    auth,

    (user) => {

        currentUser =
            user;

        console.log(
            "Current user:",
            user
        );


        // ================= PROFILE =================

        const profileName =
            getElement("profileName");


        const profileEmail =
            getElement("profileEmail");


        const profileRole =
            getElement("profileRole");


        if (user) {


            if (profileName) {

                profileName.textContent =

                    user.displayName ||

                    "FarmLink User";

            }


            if (profileEmail) {

                profileEmail.textContent =

                    user.email;

            }


            if (profileRole) {

                profileRole.textContent =

                    "Farmer / Buyer";

            }


            // ================= MY LISTINGS =================

            loadMyListings(

                user.uid

            );

        }

        else {


            if (profileName) {

                profileName.textContent =

                    "Not logged in";

            }


            if (profileEmail) {

                profileEmail.textContent =

                    "Not logged in";

            }


            if (profileRole) {

                profileRole.textContent =

                    "Guest";

            }


            const myListings =
    getElement(
        "myListingsContainer"
    );

            if (myListings) {

                myListings.innerHTML = `

                    <div class="card">

                        <p>

                            Please login to view your listings.

                        </p>

                    </div>

                `;

            }

        }

    }

);


// =====================================================
// REGISTER
// =====================================================

const registerForm =
    getElement("registerForm");


if (registerForm) {


    registerForm.addEventListener(

        "submit",

        async (event) => {


            event.preventDefault();


            const name =
                getElement(
                    "registerName"
                )?.value.trim();


            const email =
                getElement(
                    "registerEmail"
                )?.value.trim();


            const password =
                getElement(
                    "registerPassword"
                )?.value;


            if (

                !name ||

                !email ||

                !password

            ) {

                showMessage(

                    "Please fill all fields",

                    "error"

                );

                return;

            }


            try {


                const userCredential =

                    await createUserWithEmailAndPassword(

                        auth,

                        email,

                        password

                    );


                await updateProfile(

                    userCredential.user,

                    {

                        displayName:

                            name

                    }

                );


                showMessage(

                    "Account created successfully!"

                );


                registerForm.reset();


                setTimeout(() => {

                    window.location.href =
                        "login.html";

                }, 1500);


            }

            catch (error) {


                console.error(error);


                showMessage(

                    error.message,

                    "error"

                );

            }

        }

    );

}


// =====================================================
// LOGIN
// =====================================================

const loginForm =
    getElement("loginForm");


if (loginForm) {


    loginForm.addEventListener(

        "submit",

        async (event) => {


            event.preventDefault();


            const email =
                getElement(
                    "loginEmail"
                )?.value.trim();


            const password =
                getElement(
                    "loginPassword"
                )?.value;


            try {


                await signInWithEmailAndPassword(

                    auth,

                    email,

                    password

                );


                showMessage(

                    "Login successful!"

                );


                setTimeout(() => {

                    window.location.href =
                        "index.html";

                }, 1200);


            }

            catch (error) {


                console.error(error);


                showMessage(

                    "Invalid email or password",

                    "error"

                );

            }

        }

    );

}


// =====================================================
// LOGOUT
// =====================================================

const logoutBtn =
    getElement("logoutBtn");


if (logoutBtn) {


    logoutBtn.addEventListener(

        "click",

        async () => {


            await signOut(auth);


            showMessage(

                "Logged out successfully!"

            );


            setTimeout(() => {

                window.location.href =
                    "index.html";

            }, 1000);

        }

    );

}


// =====================================================
// POST LISTING
// =====================================================

const productForm =
    getElement("productForm");


if (productForm) {


    productForm.addEventListener(

        "submit",

        async (event) => {


            event.preventDefault();


            if (!currentUser) {


                showMessage(

                    "Please login to add a product",

                    "error"

                );


                setTimeout(() => {

                    window.location.href =
                        "login.html";

                }, 1000);


                return;

            }


            const productName =

                getElement(

                    "productName"

                )?.value.trim();


            const category =

                getElement(

                    "productCategory"

                )?.value;


            const price =

                getElement(

                    "productPrice"

                )?.value;


            const quantity =

                getElement(

                    "productQuantity"

                )?.value;


            const location =

                getElement(

                    "productLocation"

                )?.value.trim();


            const description =

                getElement(

                    "productDescription"

                )?.value.trim();


            const image =

                getElement(

                    "productImage"

                )?.value.trim();


            if (

                !productName ||

                !category ||

                !price ||

                !quantity ||

                !location ||

                !description

            ) {


                showMessage(

                    "Please fill all required fields",

                    "error"

                );


                return;

            }


            const productRef =

                push(

                    ref(

                        database,

                        "products"

                    )

                );


            const productData = {


                productId:

                    productRef.key,


                productName:

                    productName,


                category:

                    category,


                price:

                    Number(price),


                quantity:

                    Number(quantity),


                location:

                    location,


                description:

                    description,


                image:

                    image || "",


                sellerId:

                    currentUser.uid,


                sellerName:

                    currentUser.displayName ||

                    currentUser.email,


                sellerEmail:

                    currentUser.email,


                createdAt:

                    new Date().toISOString(),


                status:

                    "available"

            };


            try {


                await set(

                    productRef,

                    productData

                );


                showMessage(

                    "Product listed successfully!"

                );


                productForm.reset();


                setTimeout(() => {

                    window.location.href =

                        "marketplace.html";

                }, 1200);


            }

            catch (error) {


                console.error(error);


                showMessage(

                    "Failed to save product",

                    "error"

                );

            }

        }

    );

}


// =====================================================
// MARKETPLACE
// =====================================================
// =====================================================
// MARKETPLACE
// =====================================================

const productsContainer =
    getElement("productGrid");

if (productsContainer) {

    loadProducts();

}


// =====================================================
// LOAD PRODUCTS
// =====================================================

function loadProducts() {

    const productsRef =
        ref(
            database,
            "products"
        );


    onValue(

        productsRef,

        (snapshot) => {


            allProducts = [];


            if (!snapshot.exists()) {


                displayProducts(
                    allProducts
                );


                return;

            }


            const data =
                snapshot.val();


            Object.keys(data).forEach(

                (key) => {


                    allProducts.push({

                        id:
                            key,

                        ...data[key]

                    });

                }

            );


            displayProducts(

                allProducts

            );

        },


        (error) => {


            console.error(

                "Products loading error:",

                error

            );


            productsContainer.innerHTML = `

                <div class="no-products">

                    <h3>

                        Unable to load products

                    </h3>

                    <p>

                        ${error.message}

                    </p>

                </div>

            `;

        }

    );

}


// =====================================================
// DISPLAY PRODUCTS
// =====================================================

function displayProducts(products) {


    if (!productsContainer) {

        return;

    }


    productsContainer.innerHTML =
        "";


    if (

        products.length === 0

    ) {


        productsContainer.innerHTML = `

            <div class="no-products">

                <h3>

                    No products available

                </h3>

                <p>

                    Farmers have not posted any products yet.

                </p>

            </div>

        `;


        return;

    }


    products.forEach(

        (product) => {


            const card =

                document.createElement(

                    "div"

                );


            card.className =

                "product-card";


            card.innerHTML = `

                <h3>

                    ${product.productName}

                </h3>


                <p>

                    <strong>

                        Category:

                    </strong>

                    ${product.category}

                </p>


                <p class="price">

                    ₹${product.price}

                </p>


                <p>

                    <strong>

                        Quantity:

                    </strong>

                    ${product.quantity}

                </p>


                <p>

                    <strong>

                        Location:

                    </strong>

                    📍 ${product.location}

                </p>


                <p>

                    <strong>

                        Farmer:

                    </strong>

                    ${product.sellerName}

                </p>


                <button

                    class="view-product-btn"

                    data-id="${product.id}"

                >

                    View Details

                </button>


                ${

                    currentUser &&

                    currentUser.uid ===

                    product.sellerId

                    ?

                    `

                    <button

                        class="delete-product-btn"

                        data-id="${product.id}"

                    >

                        Delete Product

                    </button>

                    `

                    :

                    ""

                }

            `;


            productsContainer.appendChild(

                card

            );

        }

    );


    // =================================================
    // VIEW DETAILS BUTTON
    // =================================================

    document

        .querySelectorAll(

            ".view-product-btn"

        )

        .forEach(

            (button) => {


                button.addEventListener(

                    "click",

                    () => {


                        const product =

                            allProducts.find(

                                (item) =>

                                    item.id ===

                                    button.dataset.id

                            );


                        showProductDetails(

                            product

                        );

                    }

                );

            }

        );


    // =================================================
    // DELETE PRODUCT BUTTON
    // =================================================

    document

        .querySelectorAll(

            ".delete-product-btn"

        )

        .forEach(

            (button) => {


                button.addEventListener(

                    "click",

                    async () => {


                        const productId =

                            button.dataset.id;


                        const product =

                            allProducts.find(

                                (item) =>

                                    item.id ===

                                    productId

                            );


                        if (!product) {

                            return;

                        }


                        if (

                            !currentUser ||

                            currentUser.uid !==

                            product.sellerId

                        ) {


                            showMessage(

                                "You can delete only your own product.",

                                "error"

                            );


                            return;

                        }


                        const confirmDelete =

                            confirm(

                                "Are you sure you want to delete this product?"

                            );


                        if (

                            !confirmDelete

                        ) {

                            return;

                        }


                        try {


                            const productRef =

                                ref(

                                    database,

                                    "products/" +

                                    productId

                                );


                            await remove(

                                productRef

                            );


                            showMessage(

                                "Product deleted successfully!"

                            );


                        }

                        catch (error) {


                            console.error(

                                "Delete Error:",

                                error

                            );


                            showMessage(

                                "Failed to delete product.",

                                "error"

                            );

                        }

                    }

                );

            }

        );

}



// =====================================================
// SEARCH
// =====================================================

const searchInput =
    getElement("searchInput");


const categoryFilter =
    getElement("categoryFilter");


if (searchInput) {


    searchInput.addEventListener(

        "input",

        filterProducts

    );

}


if (categoryFilter) {


    categoryFilter.addEventListener(

        "change",

        filterProducts

    );

}


function filterProducts() {


    const searchText =

        searchInput

            ?.value

            .toLowerCase()

            .trim() || "";


    const selectedCategory =

        categoryFilter

            ?.value || "all";


    const filteredProducts =

        allProducts.filter(

            (product) => {


                const productName =

                    String(

                        product.productName

                    )

                    .toLowerCase();


                const location =

                    String(

                        product.location

                    )

                    .toLowerCase();


                const categoryMatches =

                    selectedCategory ===

                        "all" ||

                    product.category ===

                        selectedCategory;


                const searchMatches =

                    productName.includes(

                        searchText

                    ) ||

                    location.includes(

                        searchText

                    );


                return (

                    categoryMatches &&

                    searchMatches

                );

            }

        );


    displayProducts(

        filteredProducts

    );

}


// =====================================================
// PRODUCT DETAILS
// =====================================================

function showProductDetails(product) {


    if (!product) {

        return;

    }


    selectedProduct =
        product;


    getElement(

        "modalProductName"

    ).textContent =

        product.productName;


    getElement(

        "modalCategory"

    ).textContent =

        product.category;


    getElement(

        "modalPrice"

    ).textContent =

        product.price;


    getElement(

        "modalQuantity"

    ).textContent =

        product.quantity;


    getElement(

        "modalLocation"

    ).textContent =

        product.location;


    getElement(

        "modalDescription"

    ).textContent =

        product.description;


    getElement(

        "modalSeller"

    ).textContent =

        product.sellerName;


    getElement(

        "productModal"

    ).style.display =

        "flex";

}


// =====================================================
// CLOSE PRODUCT MODAL
// =====================================================

const closeProductModal =

    getElement(

        "closeProductModal"

    );


if (closeProductModal) {


    closeProductModal.addEventListener(

        "click",

        () => {


            getElement(

                "productModal"

            ).style.display =

                "none";

        }

    );

}


// =====================================================
// OPEN ORDER MODAL
// =====================================================

const placeOrderBtn =

    getElement(

        "placeOrderBtn"

    );


if (placeOrderBtn) {


    placeOrderBtn.addEventListener(

        "click",

        () => {


            if (!currentUser) {


                showMessage(

                    "Please login to place an order",

                    "error"

                );


                return;

            }


            getElement(

                "productModal"

            ).style.display =

                "none";


            getElement(

                "orderProductName"

            ).textContent =

                selectedProduct.productName;


            getElement(

                "orderProductPrice"

            ).textContent =

                selectedProduct.price;


            getElement(

                "orderQuantity"

            ).max =

                selectedProduct.quantity;


            getElement(

                "orderModal"

            ).style.display =

                "flex";

        }

    );

}


// =====================================================
// CLOSE ORDER MODAL
// =====================================================

const closeOrderModal =

    getElement(

        "closeOrderModal"

    );


if (closeOrderModal) {


    closeOrderModal.addEventListener(

        "click",

        () => {


            getElement(

                "orderModal"

            ).style.display =

                "none";

        }

    );

}


// =====================================================
// CONFIRM ORDER
// =====================================================

const confirmOrderBtn =

    getElement(

        "confirmOrderBtn"

    );


if (confirmOrderBtn) {


    confirmOrderBtn.addEventListener(

        "click",

        async () => {


            if (!selectedProduct) {

                return;

            }


            if (!currentUser) {


                showMessage(

                    "Please login first",

                    "error"

                );


                return;

            }


            const quantity =

                Number(

                    getElement(

                        "orderQuantity"

                    ).value

                );


            const address =

                getElement(

                    "deliveryAddress"

                ).value.trim();


            if (

                !quantity ||

                quantity < 1

            ) {


                showMessage(

                    "Enter valid quantity",

                    "error"

                );


                return;

            }


            if (

                quantity >

                selectedProduct.quantity

            ) {


                showMessage(

                    "Not enough quantity available",

                    "error"

                );


                return;

            }


            if (!address) {


                showMessage(

                    "Please enter delivery address",

                    "error"

                );


                return;

            }


            const orderRef =

                push(

                    ref(

                        database,

                        "orders"

                    )

                );


            const orderData = {


                orderId:

                    orderRef.key,


                productId:

                    selectedProduct.id,


                productName:

                    selectedProduct.productName,


                sellerId:

                    selectedProduct.sellerId,


                sellerName:

                    selectedProduct.sellerName,


                buyerId:

                    currentUser.uid,


                buyerName:

                    currentUser.displayName ||

                    currentUser.email,


                buyerEmail:

                    currentUser.email,


                quantity:

                    quantity,


                price:

                    selectedProduct.price,


                totalPrice:

                    quantity *

                    selectedProduct.price,


                deliveryAddress:

                    address,


                status:

                    "pending",


                createdAt:

                    new Date().toISOString()

            };


            try {


                await set(

                    orderRef,

                    orderData

                );


                showMessage(

                    "Order placed successfully!"

                );


                getElement(

                    "orderModal"

                ).style.display =

                    "none";


            }

            catch (error) {


                console.error(

                    error

                );


                showMessage(

                    "Order could not be placed",

                    "error"

                );

            }

        }

    );

}


// =====================================================
// CLOSE MODALS BY OUTSIDE CLICK
// =====================================================

window.addEventListener(

    "click",

    (event) => {


        const productModal =

            getElement(

                "productModal"

            );


        const orderModal =

            getElement(

                "orderModal"

            );


        if (

            event.target ===

            productModal

        ) {


            productModal.style.display =

                "none";

        }


        if (

            event.target ===

            orderModal

        ) {


            orderModal.style.display =

                "none";

        }

    }

);


// =====================================================
// APP LOADED
// =====================================================

console.log(

    "FarmLink Firebase App Loaded Successfully"

);
// =====================================================
// MY LISTINGS
// =====================================================

function loadMyListings(userId) {


    const myListingsContainer =
    getElement(
        "myListingsContainer"
    );

    if (!myListingsContainer) {

        return;

    }


    const productsRef =

        ref(

            database,

            "products"

        );


    onValue(

        productsRef,

        (snapshot) => {


            myListingsContainer.innerHTML =

                "";


            if (!snapshot.exists()) {


                myListingsContainer.innerHTML = `

                    <div class="card">

                        <p>

                            You have not listed any products yet.

                        </p>

                    </div>

                `;


                return;

            }


            const data =

                snapshot.val();


            let myProducts =

                [];


            Object.keys(data).forEach(

                (key) => {


                    const product =

                        data[key];


                    if (

                        product.sellerId ===

                        userId

                    ) {


                        myProducts.push({

                            id: key,

                            ...product

                        });

                    }

                }

            );


            if (

                myProducts.length ===

                0

            ) {


                myListingsContainer.innerHTML = `

                    <div class="card">

                        <p>

                            You have not listed any products yet.

                        </p>

                    </div>

                `;


                return;

            }


            myProducts.forEach(

                (product) => {


                    const listingCard =

                        document.createElement(

                            "div"

                        );


                    listingCard.className =

                        "card";


                    listingCard.innerHTML = `

                        <h3>

                            ${product.productName}

                        </h3>


                        <p>

                            <strong>

                                Category:

                            </strong>

                            ${product.category}

                        </p>


                        <p>

                            <strong>

                                Price:

                            </strong>

                            ₹${product.price}

                        </p>


                        <p>

                            <strong>

                                Quantity:

                            </strong>

                            ${product.quantity}

                        </p>


                        <p>

                            <strong>

                                Location:

                            </strong>

                            📍 ${product.location}

                        </p>


                        <p>

                            ${product.description}

                        </p>

                    `;


                    myListingsContainer.appendChild(

                        listingCard

                    );

                }

            );

        },

        (error) => {


            console.error(

                "My listings error:",

                error

            );


            myListingsContainer.innerHTML = `

                <div class="card">

                    <p>

                        Unable to load your listings.

                    </p>

                </div>

            `;

        }

    );

}