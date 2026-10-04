/* =========================================
   KAVYA MAX TIER - LEGEND ENGINE
   ========================================= */

let cart = [];
let userLocation = null;
let loggedInUser = null;
let userPhone = null;
let userCoins = 0;
let currentCategory = 'All'; 
const RESTAURANT_UPI = "yourupi@okbank"; 

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast-container');
    const msg = document.getElementById('toast-message');
    let icon = type === 'error' ? '<i class="fa-solid fa-circle-exclamation" style="color:var(--nonveg-red);"></i>' c
