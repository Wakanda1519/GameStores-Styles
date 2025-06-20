const event = new CustomEvent("setCustomConfig");
  
window.productsGrid = 4;                // Количество товаров в строке
window.oldDesignDropdownProduct = false; // true - включает, false - выключает старе отображение в выпадающем списке товара
window.currency = "₽";                  // Валюта
window.defaultPaymentAmount = 100;      // Сумма по умолчанию в поле ввода суммы пополнения
window.zeroToFree = true;               // true - включает, false - выключает отоброжние вмето нуля слово "Бесплатно"
  
window.dispatchEvent(event);

class GameStores {
    constructor() {
        this.init();

        // Информация о вашем ИП (Индивидуальный предприниматель)
        this.infoForIP = 
        {
            "status": false, // true - включает, false - выключает отображение в футере страницы (Заменяет политику конфиденциальности GS)
            "message": "ИП Имя Фамилия Очество ИНН: 2512123123123 ОГРНИП: 325200000003213123"
        }

        // Интерактивный свайпер вместо статичной шапки
        this.swiper = 
        {
            "status": true,         // true - включает, false - выключает свайпер вместо шапки (Заменяет банер)
            "autoplay": true,       // true - включает, false - выключает автопрокрутку
            "autoplayDelay": 5000,  // Задержка в миллисекундах между слайдами (1 сек = 1000 миллисекунд)
            "heightContainer": 300, // Высота контейнера свайпера
            "images": [             // Ссылки на изображения, которые будут отображаться в свайпере (Разрешение 1280х300)
                "https://files.facepunch.com/paddy/20241204/dec2024_heroposter_01.jpg",
                "https://files.facepunch.com/paddy/20241104/gesturepack_hero_01.jpg",
                "https://files.facepunch.com/paddy/20240905/rust_202409_ttk_heroimage.jpg"
            ]
        }

        this.hideProductName =
        {
            "status": true, // true - включает, false - выключает отображение имени товара при наведении
        }

        this.hideLanguageSwitcher =
        {
            "status": true, // true - включает, false - выключает отображение языкового переключателя
        }

        // Настройка бонусов при пополнении баланса
        this.bonuses = 
        {
            "status": true, // true - включает, false - выключает отображение бонусов при пополнении
            "items": [       // Список бонусов при пополнении
                {
                    "percent": "5%",
                    "amount": "~ 200 ₽"
                },
                {
                    "percent": "10%",
                    "amount": "~ 400 ₽"
                },
                {
                    "percent": "15%",
                    "amount": "~ 600 ₽"
                }
            ]
        }

        // ЗДЕСЬ ЗАКАНЧИВАЮТСЯ НАСТРОЙКИ

        this.swiperHTML = 
        `
            <div class="container swiperContainer">
                <swiper-container class="mySwiper" style="height: ${this.swiper.heightContainer}px;" navigation="false" pagination="false" autoplay="${this.swiper.autoplay}" autoplay-delay="${this.swiper.autoplayDelay}">
                    ${this.swiper.images.map((image, index) => `
                        <swiper-slide>
                            <img src="${image}" alt="Slide ${index + 1}">
                        </swiper-slide>
                    `).join('')}
                </swiper-container>
            </div>
        `

        this.balanceModalHTML = 
        `
            <section class="PlayerBalanceModal-module__bonusSection">
                <h2 class="boxHeader PlayerBalanceModal-module__header">Бонусы при пополнении</h2>
                <div class="boxBody PlayerBalanceModal-module__bonusContainer">
                    ${this.bonuses.status ? 
                        this.bonuses.items.map(bonus => `
                            <div class="PlayerBalanceModal-module__bonusItem">
                                <div class="PlayerBalanceModal-module__bonusPercent">${bonus.percent}</div>
                                <div class="PlayerBalanceModal-module__bonusAmount">${bonus.amount}</div>
                            </div>
                        `).join('') : 
                        '<div class="PlayerBalanceModal-module__bonusEmpty">Бонусы отсутствуют</div>'
                    }
                </div>
            </section>
        `
    }
  
    init() {
        window.dispatchEvent(new CustomEvent("initState"));
        window.dispatchEvent(new CustomEvent("initComponentsManager"));
        window.dispatchEvent(new CustomEvent("initEventsManager"));
  
        this.#core();
  
        window.componentsManager.load();
        window.eventsManager.load();
    }

    #core() {
        const swiperHandler = () => {
            if (this.swiper.status) {
                if (!document.querySelector('script[src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-element-bundle.min.js"]')) {
                    const script = document.createElement('script');
                    script.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-element-bundle.min.js';
                    document.head.appendChild(script);
                }

                const existingSwiper = document.querySelector('.swiperContainer');
                if (!existingSwiper) {
                    const bannerContainer = document.querySelector('.container.bannerContainer');
                    if (bannerContainer) {
                        bannerContainer.style.display = 'none';
                        bannerContainer.insertAdjacentHTML('beforebegin', this.swiperHTML);
                    }
                }
            }
        };

        window.componentsManager.addListener("SHOP_PAGE", "DID_MOUNT", () => {
            if (this.infoForIP.status) {
                const shopFooterLinks = document.querySelector('.ShopFooter-module__links');
                if (shopFooterLinks) {
                    shopFooterLinks.style.display = 'none';
                    const infoParagraph = document.createElement('p');
                    infoParagraph.textContent = this.infoForIP.message;
                    infoParagraph.className = 'ShopFooter-module__ipInfo';
                    shopFooterLinks.parentNode.insertBefore(infoParagraph, shopFooterLinks.nextSibling);
                }
            }

            swiperHandler();

            if (this.hideProductName.status && !document.querySelector('style[data-hide-product-name]')) {
                const style = document.createElement('style');
                style.textContent = '.Product-module__name { display: none; }';
                style.setAttribute('data-hide-product-name', 'true');
                document.head.appendChild(style);
            }

            if (this.hideLanguageSwitcher.status && !document.querySelector('style[data-hide-language-switcher]')) {
                const style = document.createElement('style');
                style.textContent = '.LangSwitcher-module__wrapper, .PlayerMenuMobile-module__langSwitcher { display: none; }';
                style.setAttribute('data-hide-language-switcher', 'true');
                document.head.appendChild(style);
            }
        });

        window.componentsManager.addListener("BALANCE_MODAL", "DID_MOUNT", () => {
            if (this.bonuses.status) {
                const balanceModal = document.querySelector('.PlayerBalance-module__modal');
                if (balanceModal && !balanceModal.querySelector('.PlayerBalanceModal-module__bonusSection')) {
                    balanceModal.insertAdjacentHTML('beforeend', this.balanceModalHTML);
                }
            }
        });

        window.componentsManager.addListener("PROFILE_PAGE", "DID_MOUNT", swiperHandler);
    }
}
  
if (window.isAppReady) {
    new GameStores();
} else {
    window.addEventListener("appReady", () => {
        new GameStores();
    });
}