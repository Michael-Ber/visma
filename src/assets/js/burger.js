export const burgerInteraction = () => {
    try {
        const burgerBtn = document.querySelector('.header-burger__btn');
        const menu = document.querySelector('.header-burger__menu');
        const body = document.querySelector('body');
        const links = document.querySelectorAll('.header-burger__item');
        const close = document.querySelector('.header-burger__close');
        burgerBtn.addEventListener('click', (e) => {
            menu.classList.toggle('header-burger__menu_active');
            burgerBtn.classList.toggle('header-burger__btn_active');
            if(burgerBtn.classList.contains('header-burger__btn_active')) {
                burgerBtn.setAttribute('aria-expanded', true);
            }else {
                burgerBtn.setAttribute('aria-expanded', false);
                
            }
            if(!menu.classList.contains('header-burger__menu_active')) {
                body.style.overflow = 'auto';
                menu.setAttribute('aria-hidden', true)
            }else {
                menu.setAttribute('aria-hidden', false)
            }
        })
        window.addEventListener('resize', () => {
            menu.classList.remove('header-burger__menu_active');
            burgerBtn.classList.remove('header-burger__btn_active');
        })
        window.addEventListener('scroll', () => {
            if(menu.classList.contains('header-burger__menu_active')) {
                body.style.overflow = 'hidden';
            }else {
                body.style.overflow = 'auto';
            }
        })
        links.forEach(item => {
            item.addEventListener('click', () => {
                menu.classList.remove('header-burger__menu_active');
                burgerBtn.classList.remove('header-burger__btn_active');
            })
        })
        close.addEventListener('click', () => {
            menu.classList.remove('header-burger__menu_active');
            burgerBtn.classList.remove('header-burger__btn_active');
            burgerBtn.setAttribute('aria-expanded', false);
            menu.setAttribute('aria-hidden', true)
        })
        
    } catch (error) {
        console.log(error)
    }
}