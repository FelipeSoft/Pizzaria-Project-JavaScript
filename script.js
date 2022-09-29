const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

var modalQt = 1;
var cart = [];
var modalKey = 0;

pizzasJson.map((item, index)=>{
    let pizzaItem = c('#cardapio .models .pizza-item-01').cloneNode(true);
    let pizzaModal = c('.pizza-window-transparent');

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item-01--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item-01--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item-01--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item-01--desc').innerHTML = item.description;
    pizzaItem.querySelector('a').addEventListener('click', function(e){
        e.preventDefault();
        let key = e.target.closest('.pizza-item-01').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;

        pizzaModal.querySelector('.pizza-window-area .pizza-window--img img').src = pizzasJson[key].img;
        pizzaModal.querySelector('.pizza-window-area .pizza-window--content .pizza-content--name').innerHTML = pizzasJson[key].name;
        pizzaModal.querySelector('.pizza-window-area .pizza-window--content .pizza-content--desc').innerHTML = pizzasJson[key].description;
        pizzaModal.querySelector('.pizza-window-area .pizza-window--content .container--price .pizza-content--price').innerHTML = `R$ ${pizzasJson[key].price.toFixed(2)}`;
        c('.pizzaInfo--size.selected').classList.remove('selected')
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex == 2){
                size.classList.add('selected');
            }   
        });

        if(pizzasJson[modalKey].id === 19 || pizzasJson[modalKey].id === 20 || pizzasJson[modalKey].id === 21){
            c('.pizzaInfo--size:nth-child(1)').innerHTML = '350ml';
            c('.pizzaInfo--size:nth-child(2)').innerHTML = '700ml';
            c('.pizzaInfo--size:nth-child(3)').innerHTML = '1 Litro';
        }

        pizzaModal.querySelector('.pizza-window-area .pizza-window--content .container--price .qtd--number').innerHTML = modalQt;

        pizzaModal.style.opacity = 0;
        pizzaModal.style.display = 'flex';
        setTimeout(()=>{
            pizzaModal.style.opacity = 1;
        }, 200);
    });

    c('main .pizza-area').append( pizzaItem );
});

window.onscroll = function(){
    let btnScrollTop = c('.button-scroll--top')

    if(window.scrollY > 100){
        btnScrollTop.style.display = 'flex'
        btnScrollTop.addEventListener('click', function(){
            window.scrollTo({
                top:0,
                left:0,
                behavior:'smooth'
            })
        });
    } else {
        btnScrollTop.style.display = 'none'
    }
}

//funções do pizzaModal

function closeModal() {
    c('.pizza-window-transparent').style.opacity = 0;
    setTimeout(()=>{
        c('.pizza-window-transparent').style.display = 'none';
    }, 700);
}

c('.container--price .pizza-content--qtd .qtd--mais').addEventListener('click', ()=>{
    modalQt++;
    c('.container--price .pizza-content--qtd .qtd--number').innerHTML = modalQt;
})

c('.container--price .pizza-content--qtd .qtd--menos').addEventListener('click', ()=>{
    if(modalQt > 1){
        modalQt--;
        c('.container--price .pizza-content--qtd .qtd--number').innerHTML = modalQt;
    }
})
cs('.pizzaInfo--size').forEach(function(size, sizeIndex){
    size.addEventListener('click', function(e){
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});
c('#cart-opened i').addEventListener('click', function(){
    c('#cart-opened').style.display = 'none';
});
cs('.buttons #btn-cancel, .button-mobile #btn-mobile-cancel').forEach((item)=>{
    item.addEventListener('click', closeModal);
});
c('.buttons #btn-cart').addEventListener('click', function(){
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzasJson[modalKey].id + '@' + size;
    let key = cart.findIndex((item)=>item.identifier == identifier)

    if(key > -1){
        cart[key].qtd += modalQt;
    } else {
        cart.push({
            identifier,
            id:pizzasJson[modalKey].id,
            size,
            qtd:modalQt
        });    
    }
    updateCart();
    closeModal();
});

c('header i').addEventListener('click', () => {
    if(cart.length > 0) {
        c('#cart-opened').style.display = 'flex';
    }
});
c('#cart-opened i').addEventListener('click', ()=>{
    c('#cart-opened').style.display = 'none';
});

function updateCart(){
    c('header span').innerHTML = cart.length;
    c('.cart-items').innerHTML = '';

    if(cart.length > 0) {
        c('#cart-opened').style.display = 'flex';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) {
            let pizzaItem = pizzasJson.find((item)=>item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qtd;

            let cartItem = c('#cart-opened .container-cart .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
            
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qtd;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qtd > 1) {
                    cart[i].qtd--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qtd++;
                updateCart();
            });

            c('.cart-items').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.priceMyPizzas--01').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.priceMyPizzas--02').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.priceMyPizzas--03').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        c('#cart-opened').style.display = 'none';
    }
}