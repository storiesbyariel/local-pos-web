(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))u(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const f of o.addedNodes)f.tagName==="LINK"&&f.rel==="modulepreload"&&u(f)}).observe(document,{childList:!0,subtree:!0});function t(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function u(n){if(n.ep)return;n.ep=!0;const o=t(n);fetch(n.href,o)}})();function h(i){return Math.round((Number(i)+Number.EPSILON)*100)/100}function L(i,e){return h(Math.max(0,i)*Math.max(0,e))}function x(i,e,t){const u=Math.max(0,Number(i)||0),n=Math.max(0,Number(t)||0);let o=0;return e==="percent"?o=u*Math.min(n,100)/100:o=Math.min(n,u),{discountAmount:h(o),discountedSubtotal:h(u-o)}}function q(i,e,t,u){const n=h(i.reduce((c,b)=>c+L(b.qty,b.unitPrice),0)),{discountAmount:o,discountedSubtotal:f}=x(n,e,t),l=Math.max(0,Number(u)||0),m=h(f*l/100),y=h(f+m);return{subtotal:n,discountAmount:o,discountedSubtotal:f,taxAmount:m,grandTotal:y}}const P="local_pos_mvp_v1",g={items:[],cart:[],taxRate:8,discountType:"flat",discountValue:0,transactions:[],lastReceipt:null};function A(i=localStorage){try{const e=i.getItem(P);if(!e)return structuredClone(g);const t=JSON.parse(e);return{...structuredClone(g),...t,items:Array.isArray(t.items)?t.items:[],cart:Array.isArray(t.cart)?t.cart:[],transactions:Array.isArray(t.transactions)?t.transactions:[]}}catch{return structuredClone(g)}}function M(i,e=localStorage){e.setItem(P,JSON.stringify(i))}function S(){return Math.random().toString(36).slice(2,10)}function p(i){return`$${Number(i||0).toFixed(2)}`}function E({storage:i=localStorage}={}){const e=A(i);function t(){M(e,i)}function u({id:r,name:s,unitPrice:a}){const d=String(s||"").trim(),v=h(Math.max(0,Number(a)||0));if(d){if(r){const $=e.items.find(T=>T.id===r);$&&($.name=d,$.unitPrice=v)}else e.items.push({id:S(),name:d,unitPrice:v});t()}}function n(r){e.items=e.items.filter(s=>s.id!==r),e.cart=e.cart.filter(s=>s.itemId!==r),t()}function o(r){const s=e.items.find(d=>d.id===r);if(!s)return;const a=e.cart.find(d=>d.itemId===r);a?a.qty+=1:e.cart.push({itemId:r,qty:1,unitPrice:s.unitPrice}),t()}function f(r,s){const a=Math.max(0,Number(s)||0),d=e.cart.find(v=>v.itemId===r);d&&(a===0?e.cart=e.cart.filter(v=>v.itemId!==r):d.qty=a,t())}function l(r,s){const a=h(Math.max(0,Number(s)||0)),d=e.cart.find(v=>v.itemId===r);d&&(d.unitPrice=a,t())}function m(r,s){e.discountType=r==="percent"?"percent":"flat",e.discountValue=h(Math.max(0,Number(s)||0)),t()}function y(r){e.taxRate=h(Math.max(0,Number(r)||0)),t()}function c(){return e.cart.map(r=>{const s=e.items.find(a=>a.id===r.itemId);return{...r,name:(s==null?void 0:s.name)||"Deleted Item"}})}function b(r){const s=c();if(s.length===0)return null;const a=q(s,e.discountType,e.discountValue,e.taxRate),d={id:S(),timestamp:new Date().toISOString(),paymentMethod:r==="card"?"card":"cash",items:s,discountType:e.discountType,discountValue:e.discountValue,taxRate:e.taxRate,totals:a};return e.transactions.unshift(d),e.lastReceipt=d,e.cart=[],e.discountValue=0,t(),d}return{state:e,upsertItem:u,deleteItem:n,addToCart:o,setQty:f,setLineUnitPrice:l,setDiscount:m,setTaxRate:y,getCartDetailed:c,checkout:b}}function I(i,{storage:e=localStorage}={}){const t=E({storage:e});let u=null;function n(){const l=t.getCartDetailed(),m=q(l,t.state.discountType,t.state.discountValue,t.state.taxRate),y=u?t.state.items.find(c=>c.id===u):null;i.innerHTML=`
      <main class="layout">
        <h1>Local POS MVP</h1>

        <section class="card">
          <h2>Item Catalog (CRUD)</h2>
          <form id="item-form">
            <input id="item-name" placeholder="Item name" required value="${y?y.name:""}" />
            <input id="item-price" type="number" min="0" step="0.01" placeholder="Unit price" required value="${y?y.unitPrice:""}" />
            <button type="submit">${u?"Update Item":"Add Item"}</button>
            ${u?'<button type="button" id="cancel-edit">Cancel</button>':""}
          </form>
          <ul class="list">
            ${t.state.items.map(c=>`
              <li>
                <span>${c.name} (${p(c.unitPrice)})</span>
                <div class="row-actions">
                  <button data-action="add" data-id="${c.id}">Add to Cart</button>
                  <button data-action="edit" data-id="${c.id}">Edit</button>
                  <button data-action="delete" data-id="${c.id}">Delete</button>
                </div>
              </li>
            `).join("")||"<li>No items yet.</li>"}
          </ul>
        </section>

        <section class="card">
          <h2>Cart</h2>
          <ul class="list">
            ${l.map(c=>`
              <li>
                <div>
                  <strong>${c.name}</strong><br />
                  Qty: <input data-action="qty" data-id="${c.itemId}" type="number" min="0" value="${c.qty}" />
                  Unit: <input data-action="price" data-id="${c.itemId}" type="number" min="0" step="0.01" value="${c.unitPrice}" />
                </div>
                <span>${p(c.qty*c.unitPrice)}</span>
              </li>
            `).join("")||"<li>Cart is empty.</li>"}
          </ul>

          <div class="controls">
            <label>
              Discount type
              <select id="discount-type">
                <option value="flat" ${t.state.discountType==="flat"?"selected":""}>Flat ($)</option>
                <option value="percent" ${t.state.discountType==="percent"?"selected":""}>Percent (%)</option>
              </select>
            </label>
            <label>
              Discount value
              <input id="discount-value" type="number" min="0" step="0.01" value="${t.state.discountValue}" />
            </label>
            <label>
              Tax rate (%)
              <input id="tax-rate" type="number" min="0" step="0.01" value="${t.state.taxRate}" />
            </label>
          </div>

          <div class="totals">
            <div>Subtotal: ${p(m.subtotal)}</div>
            <div>Discount: -${p(m.discountAmount)}</div>
            <div>Tax: ${p(m.taxAmount)}</div>
            <div><strong>Total: ${p(m.grandTotal)}</strong></div>
          </div>

          <div class="row-actions">
            <button id="checkout-cash">Checkout (Cash)</button>
            <button id="checkout-card">Checkout (Card)</button>
          </div>
        </section>

        <section class="card">
          <h2>Receipt (Latest)</h2>
          ${t.state.lastReceipt?o(t.state.lastReceipt):"<p>No receipt yet.</p>"}
        </section>

        <section class="card">
          <h2>Transaction History</h2>
          <ul class="list small">
            ${t.state.transactions.map(c=>`
              <li>
                ${new Date(c.timestamp).toLocaleString()} - ${c.paymentMethod.toUpperCase()} - ${p(c.totals.grandTotal)}
              </li>
            `).join("")||"<li>No transactions yet.</li>"}
          </ul>
        </section>
      </main>
    `,f()}function o(l){return`
      <div class="receipt">
        <div>${new Date(l.timestamp).toLocaleString()}</div>
        <div>Payment: ${l.paymentMethod.toUpperCase()}</div>
        <ul>
          ${l.items.map(m=>`<li>${m.name} x${m.qty} @ ${p(m.unitPrice)} = ${p(m.qty*m.unitPrice)}</li>`).join("")}
        </ul>
        <div>Subtotal: ${p(l.totals.subtotal)}</div>
        <div>Discount: -${p(l.totals.discountAmount)}</div>
        <div>Tax: ${p(l.totals.taxAmount)}</div>
        <div><strong>Total: ${p(l.totals.grandTotal)}</strong></div>
      </div>
    `}function f(){var m,y,c,b,r,s;const l=i.querySelector("#item-form");l==null||l.addEventListener("submit",a=>{a.preventDefault();const d=i.querySelector("#item-name").value,v=i.querySelector("#item-price").value;t.upsertItem({id:u,name:d,unitPrice:v}),u=null,n()}),(m=i.querySelector("#cancel-edit"))==null||m.addEventListener("click",()=>{u=null,n()}),i.querySelectorAll('button[data-action="add"]').forEach(a=>a.addEventListener("click",()=>{t.addToCart(a.dataset.id),n()})),i.querySelectorAll('button[data-action="delete"]').forEach(a=>a.addEventListener("click",()=>{t.deleteItem(a.dataset.id),n()})),i.querySelectorAll('button[data-action="edit"]').forEach(a=>a.addEventListener("click",()=>{u=a.dataset.id,n()})),i.querySelectorAll('input[data-action="qty"]').forEach(a=>a.addEventListener("change",()=>{t.setQty(a.dataset.id,a.value),n()})),i.querySelectorAll('input[data-action="price"]').forEach(a=>a.addEventListener("change",()=>{t.setLineUnitPrice(a.dataset.id,a.value),n()})),(y=i.querySelector("#discount-type"))==null||y.addEventListener("change",a=>{t.setDiscount(a.target.value,t.state.discountValue),n()}),(c=i.querySelector("#discount-value"))==null||c.addEventListener("change",a=>{t.setDiscount(t.state.discountType,a.target.value),n()}),(b=i.querySelector("#tax-rate"))==null||b.addEventListener("change",a=>{t.setTaxRate(a.target.value),n()}),(r=i.querySelector("#checkout-cash"))==null||r.addEventListener("click",()=>{t.checkout("cash"),n()}),(s=i.querySelector("#checkout-card"))==null||s.addEventListener("click",()=>{t.checkout("card"),n()})}return n(),t}const N=document.querySelector("#app");I(N);
