'use strict'; //kod będzie uruchamiany w "trybie ścisłym" - pomyłki, które normalnie nie wywołałyby błędu, teraz będą traktowane jak błąd i wyświetlane na czerwono

/* Display article after click event  */
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
    clickedElement.classList.add('active');
    console.log('clickedElement:', clickedElement);
    /* [DONE] remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts article.post.active');
    for(let activeArticle of activeArticles){
        activeArticle.classList.remove('active');
    }
    /* [DONE] get 'href' attribute from the clicked link */
    const articleSelector = clickedElement.getAttribute('href'); //przypisanie do stałej "articleSelector" wartości atrybutu "href" pobranej z klikniętego linka
    console.log('Href value was assigned: ', articleSelector);
    /* [DONE] find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleSelector); //przypisanie wartość stałej "targetArticle" funkcji "querySelector", wyszukującej artykuł o danym atrybucie href (zapisanym w stałej "articleSelector")
    console.log(targetArticle);
    /* [DONE] add class 'active' to the correct article */
    targetArticle.classList.add('active');
    console.log('Right article was displayed');
}



/* Generate list of titles */
const optArticleSelector = '.post'; //zapisanie "ustawień" skryptu w stałych
const optTitleSelector = '.post-title';
const optTitleListSelector = '.titles';

function generateTitleLinks(){
    /* remove content of titleList */
    const titleList = document.querySelector(optTitleListSelector); //znalezienie listy linków i przypisanie jej do stałej "titleList"
    function clearMessages(){ //funkcja usuwająca zawartość elementu "titleList"
        titleList.innerHTML = '';
        }
    clearMessages(); //wywołanie funkcji
    /* for each article */
    const articles = document.querySelectorAll(optArticleSelector); //zapisanie do stałej "articles" odniesienia do wszystkich elementów pasujących do selektora zapisanego w stałej "optArticleSelector"
    let html = ''; //stworzenie zmiennej (nie stałej!) "html", do której będą kolejno doklejane wszystkie linki
    for(let article of articles){ //utworznie pętli do wykonania pozostałych operacji z osobna dla każdego z artykułów
        /* get the article id */
        const articleId = article.getAttribute('id');
        /* find the title element; get the title from the title element */
        const articleTitle = article.querySelector(optTitleSelector).innerHTML; //odnalezienie elementu za pomocą "querySelector"; odczytanie i zapisanie zawartości elementu za pomocą "innerHtml"
        /* create HTML of the link */
        const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
        //console.log(linkHTML);
        /* insert (wstaw) link into titleList */
        html = html + linkHTML; //analogicznie: x = x + 1, po każdej iteracji w pętli dodajemy kolejną linijkę kodu HTML do zmiennej
    }
    titleList.innerHTML = html; //przypisanie (za jednym razem! - optymalne rozwiązanie) wszystkich linijek kodu HTML do listy
}

generateTitleLinks();

/* kod odpowiedzialny za powiązanie kliknięcia w linki z funkcją "titleClickHandler"
musimy umieścić za wywołaniem funkcji "generateTitleLinks" -
- najpierw trzeba wygenerować linki, a dopiero potem można dzięki nim przełączać artykuły */
const links = document.querySelectorAll('.titles a'); //przypisanie do stałej "links" wszystkich elementów, pasujących do selektora ".titles a"
for(let link of links){ //przypisanie "event listenerów" do każdego linka za pomocą pętli
    link.addEventListener('click', titleClickHandler); //wywołanie funkcji "titleClickHandler" spowodowane zdarzeniem "click"
}