'use strict'; //kod będzie uruchamiany w "trybie ścisłym" - pomyłki, które normalnie nie wywołałyby błędu, teraz będą traktowane jak błąd i wyświetlane na czerwono

function titleClickHandler(event){ //funkcja, która jest wykonywana w reakcji na event (kliknięcie na link); w argumencie "event" można znaleźć m.in. informacje "target", która zawiera odniesienie do <span>
    event.preventDefault(); //blokuje mechanizm automatycznego przewijania strony oraz zmiany adresu url w skutek kliknięcia na link
    const clickedElement = this; //obiekt "this" wskazuje na element, do którego dodaliśmy listener, czyli <a>
    console.log('Link was clicked!');
    /* [DONE] remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');
    for(let activeLink of activeLinks){
        activeLink.classList.remove('active');
    }
    /* [DONE] add class 'active' to the clicked link */
    console.log('clickedElement:', clickedElement);
    clickedElement.classList.add('active');
    /* [DONE] remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts article.post.active');
    for(let activeArticle of activeArticles){
        activeArticle.classList.remove('active');
    }
    /* get 'href' attribute from the clicked link */
    const articleSelector = clickedElement.getAttribute('href'); //przypisanie do stałej "articleSelector" wartości atrybutu "href" pobranej z klikniętego linka
    console.log('href= ', articleSelector);
    /* find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleSelector); //przypisanie wartość stałej "targetArticle" funkcji "querySelector", wyszukującej artykuł o danym atrybucie href (zapisanym w stałej "articleSelector")
    console.log(targetArticle);
    /* add class 'active' to the correct article */
}

const links = document.querySelectorAll('.titles a'); //przypisanie do stałej "links" wszystkich elementów, pasujących do selektora ".titles a"

for(let link of links){ //przypisanie "event listenerów" do każdego linka za pomocą pętli
    link.addEventListener('click', titleClickHandler); //wywołanie funkcji "titleClickHandler" spowodowane zdarzeniem "click"
}