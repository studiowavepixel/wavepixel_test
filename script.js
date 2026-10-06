const root = document.documentElement;
const themeBtn = document.getElementById('themeToggle');
const mobileThemeBtn = document.getElementById('mobileThemeToggle');
const saved = localStorage.getItem('theme') || 'light';
root.setAttribute('data-theme', saved);

function updateThemeIcons(){
  const isDark = root.getAttribute('data-theme') === 'dark';
  themeBtn.textContent = isDark ? '☀️' : '🌙';
  mobileThemeBtn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
}
updateThemeIcons();

function toggleTheme(){
  const cur = root.getAttribute('data-theme');
  const nxt = cur === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', nxt);
  localStorage.setItem('theme', nxt);
  updateThemeIcons();
}
themeBtn.onclick = toggleTheme;
mobileThemeBtn.onclick = () => { toggleTheme(); };

const animObs = new IntersectionObserver(es=>{
  es.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in'); });
},{threshold:0.15});
document.querySelectorAll('.anim').forEach(el=>animObs.observe(el));

let views = parseInt(localStorage.getItem('wavepixel_views') || '347');
views += 1;
localStorage.setItem('wavepixel_views', views);
let hasAnimated = false;
function animateCount(el,t){
  let c=0; const s=Math.ceil(t/60);
  const tm=setInterval(()=>{ c+=s; if(c>=t){ c=t; clearInterval(tm);} el.textContent=c.toLocaleString(); },20);
}
const aboutSection=document.getElementById('about');
const aboutObserver=new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting && !hasAnimated){
      hasAnimated=true;
      animateCount(document.getElementById('viewCount'),views);
      animateCount(document.getElementById('visualCount'),views);
      animateCount(document.getElementById('footerCount'),views);
      setTimeout(()=>{hasAnimated=false;},4000);
    }
  });
},{threshold:0.5});
aboutObserver.observe(aboutSection);

const hamburger=document.getElementById('hamburger');
const mobileMenu=document.getElementById('mobileMenu');
const mobileOverlay=document.getElementById('mobileOverlay');
const closeMobile=document.getElementById('closeMobile');

function openMobileMenu(){
  mobileMenu.classList.add('open');
  hamburger.classList.add('active');
  document.body.style.overflow='hidden';
}
function closeMobileMenu(){
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('active');
  document.body.style.overflow='';
}
hamburger.onclick=()=>{
  mobileMenu.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
};
mobileOverlay.onclick=closeMobileMenu;
closeMobile.onclick=closeMobileMenu;
window.closeMobileMenu=closeMobileMenu;

const waBtn=document.getElementById('whatsappBtn');
const waWrap=document.getElementById('waIframeWrap');
function openWhatsapp(){ waWrap.classList.add('open'); }
function closeWhatsapp(){ waWrap.classList.remove('open'); }
waBtn.onclick=()=>{ waWrap.classList.contains('open') ? closeWhatsapp() : openWhatsapp(); };
window.openWhatsapp=openWhatsapp;
window.closeWhatsapp=closeWhatsapp;

let cart=[];
const cartCount=document.getElementById('cartCount');
const mobileCartCount=document.getElementById('mobileCartCount');
const cartItems=document.getElementById('cartItems');
const drawer=document.getElementById('cartDrawer');

function addToCart(name,price){
  cart.push({name,price});
  updateCart();
  drawer.classList.add('open');
}
function updateCart(){
  cartCount.textContent=cart.length;
  mobileCartCount.textContent=cart.length;
  cartCount.style.display=cart.length?'grid':'none';
  mobileCartCount.style.display=cart.length?'grid':'none';
  if(cart.length===0){
    cartItems.innerHTML='<p style="color:var(--text-soft);text-align:center;padding:40px 0">Cart empty</p>';
    return;
  }
  let total=0;
  cartItems.innerHTML=cart.map((c,i)=>{
    total+=c.price;
    return `<div style="display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--border)"><div><b>${c.name}</b><div style="font-size:12px;color:var(--text-soft)">Rs ${c.price}</div></div><button onclick="removeCart(${i})" style="border:none;background:var(--bg-soft);width:28px;height:28px;border-radius:50%;cursor:pointer">✕</button></div>`;
  }).join('')+`<div style="margin-top:16px;display:flex;justify-content:space-between;font-weight:700"><span>Total</span><span>Rs ${total}</span></div><button class="btn btn-primary" style="width:100%;margin-top:16px" onclick="checkout()">Checkout via WhatsApp</button>`;
}
function removeCart(i){ cart.splice(i,1); updateCart(); }
function checkout(){
  const msg=encodeURIComponent('Hi WavePixel, I want: '+cart.map(c=>`${c.name} Rs${c.price}`).join(', '));
  window.open(`https://wa.me/94770254759?text=${msg}`,'_blank');
}
document.getElementById('cartBtn').onclick=()=>drawer.classList.add('open');
document.getElementById('mobileCartBtn').onclick=()=>{
  closeMobileMenu();
  setTimeout(()=>drawer.classList.add('open'),300);
};
document.getElementById('closeCart').onclick=()=>drawer.classList.remove('open');
document.getElementById('cartOverlay').onclick=()=>drawer.classList.remove('open');

function openModal(id){ document.getElementById(id).classList.add('open'); }
function closeModal(id){ document.getElementById(id).classList.remove('open'); }
document.getElementById('loginBtn').onclick=()=>openModal('loginModal');
document.getElementById('signupBtn').onclick=()=>openModal('signupModal');
document.getElementById('mobileLoginBtn').onclick=()=>{
  closeMobileMenu();
  setTimeout(()=>openModal('loginModal'),300);
};
document.getElementById('mobileSignupBtn').onclick=()=>{
  closeMobileMenu();
  setTimeout(()=>openModal('signupModal'),300);
};
document.getElementById('heroLogin').onclick=()=>openModal('loginModal');

window.addToCart=addToCart;
window.removeCart=removeCart;
window.checkout=checkout;
window.closeModal=closeModal;