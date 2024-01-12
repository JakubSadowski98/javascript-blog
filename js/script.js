'use strict'; //kod będzie uruchamiany w "trybie ścisłym" - pomyłki, które normalnie nie wywołałyby błędu, teraz będą traktowane jak błąd i wyświetlane na czerwono

/* zapisanie "ustawień" skryptu w stałych; prefiks "opt-" (skrót od option) ma odróżniać te stałe */
const optArticleSelector = '.post', //selektor artykułów
  optTitleSelector = '.post-title', //selektor tytułów artykułów
  optTitleListSelector = '.titles', //selektor listy tytułów (linków)
  optArticleTagsSelector = '.post-tags .list'; //selektor wybierze nam listę <ul>, w której będą zawarte tagi poszczególnych artykułów

/* Display article after click event  */
function titleClickHandler(event){ //funkcja, która jest wykonywana w reakcji na event (kliknięcie na link); w argumencie "event" można znaleźć m.in. informacje "target", która zawiera odniesienie do <span>
  console.log('Link was clicked: function titleClickHandler() was run');
  event.preventDefault(); //blokuje mechanizm automatycznego przewijania strony w miejsce wskazanego przez link id (np. do artykułu) oraz zmiany adresu url w skutek kliknięcia na link
  const clickedElement = this; //obiekt "this" wskazuje na element, do którego dodaliśmy "event listener", czyli na link <a>
  /* ALGORITHM STEPS */
  /* 1. Remove class 'active' from all article links [DONE] */
  const activeLinks = document.querySelectorAll('.titles a.active');
  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }
  /* 2. Add class 'active' to the clicked link [DONE] */
  clickedElement.classList.add('active');
  console.log('ClickedElement: ', clickedElement);
  /* 3. Remove class 'active' from all articles [DONE] */
  const activeArticles = document.querySelectorAll('.posts article.post.active');
  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }
  /* 4. Get 'href' attribute from the clicked link [DONE] */
  const articleSelector = clickedElement.getAttribute('href'); //przypisanie do stałej "articleSelector" wartości atrybutu "href" pobranej z klikniętego linka
  console.log('Href s value was assigned to articleSelector: ', articleSelector);
  /* 5. Find the correct article using the selector (href s value) [DONE] */
  const targetArticle = document.querySelector(articleSelector); //przypisanie elementu do stałej "targetArticle" za pomocą funkcji "querySelector", wyszukującej artykuł o danej wartości atrybutu href (zapisanej w stałej "articleSelector")
  console.log('Selected Article: ',targetArticle);
  /* 6. Add class 'active' to the correct article [DONE] */
  targetArticle.classList.add('active');
  console.log('Right article was displayed');
}

/* Generate list of title-links */
function generateTitleLinks(){
  /* ALGORITHM STEPS */
  /* 1. Remove content of titleList [DONE] */
  const titleList = document.querySelector(optTitleListSelector); //znalezienie listy linków i przypisanie jej do stałej "titleList"
  function clearMessages(){ //funkcja usuwająca zawartość elementu "titleList" - usuwa wszystkie linki
    titleList.innerHTML = '';
  }
  clearMessages(); //wywołanie funkcji

  /* for each article */
  const articles = document.querySelectorAll(optArticleSelector); //zapisanie do stałej "articles" odniesienia do wszystkich artykułów
  let html = ''; //stworzenie zmiennej (nie stałej!) "html", w której zapiszemy linijki kodu HTML dla linków
  for(let article of articles){ //utworznie pętli do wykonania pozostałych operacji z osobna dla każdego z artykułów
    /* 2. Get the article id [DONE] */
    const articleId = article.getAttribute('id');
    /* 3. Find the title element; get the title from the title element [DONE] */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML; //odnalezienie elementu za pomocą "querySelector"; odczytanie zawartości elementu za pomocą "innerHtml"
    /* 4. Create HTML of the link [DONE] */
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>'; //stała "linkHTML" będzie przechowywała kod HTML; podwójny cudzysłów "" jest elementem kodu HTML zatem trzeba go objąć pojedynczym cudzysłowiem ''
    /* 5. Insert (wstaw) link into titleList [DONE] */
    html = html + linkHTML; //analogicznie: x = x + 1, po każdej iteracji pętli dodajemy kolejną linijkę kodu HTML do zmiennej
  }
  titleList.innerHTML = html; //wstawienie (za jednym razem! - optymalne rozwiązanie) wszystkich linijek kodu HTML do listy
}

generateTitleLinks(); //wywołanie funkcji, która wygeneruje linki na podstawie odniesienia do tytułów zawartych w elementach <article>

/* kod odpowiedzialny za powiązanie kliknięcia w linki z funkcją "titleClickHandler"
musimy umieścić za wywołaniem funkcji "generateTitleLinks" -
- najpierw trzeba wygenerować linki, a dopiero potem można dzięki nim przełączać artykuły */
const links = document.querySelectorAll('.titles a'); //przypisanie do stałej "links" wszystkich elementów, pasujących do selektora ".titles a", zatem element "links" będzie zawierał jakąś liczbę linków
for(let link of links){ //przypisanie "event listenerów" do każdego linka zawierającego się w stałej "links" za pomocą pętli
  link.addEventListener('click', titleClickHandler); //powiązanie kliknięcia w link z funkcją "titleClickHandler", inaczej mówiąc: zdarzenie "click" ma wywoływać funkcję "titleClickHandler"
}

/* Generate tags for every article */
function generateTags(){
  /* ALGORITHM STEPS */
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector); //stała "articles" jest kolekcją wielu elementów, które zawierają odniesienie do każdego artykułu
  /* START LOOP: for every article: */
  for(let article of articles){ //za pomocą pętli przechodzimy (iterujemy) po kolekcji elementów zawartych w "articles"
    /* find tags wrapper */
    const tagsWrapper = article.querySelector(optArticleTagsSelector); //w tej stałej będą umieszczone tagi-linki
    /* make html variable with empty string */
    let html = ''; //zmienna będzie przyjmować kolejne fragmenty kodu HTML
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags'); //"articleTags" przyjmie pobrane tagi w formie tekstu
    /* split tags into array */
    const articleTagsArray = articleTags.split(' '); //utworzono tablicę - funkcja ".split(' ')" usunie spacje oraz upodzieli tekst zawarty w "articleTags" na osobne elementy, które od teraz będą zawarte w tablicy "articleTagsArray"
    /* START LOOP: for each tag */
    for(let tag of articleTagsArray){ //wewnątrz pętli zmienna "tag" będzie treścią pojedynczego taga
    /* generate HTML of the link */
      const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
    /* add generated code to html variable */
      html = html + linkHTML;
      console.log(html);
    /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    tagsWrapper.innerHTML = html;
    /* END LOOP: for every article: */
  }
}
generateTags();
