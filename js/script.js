'use strict'; //kod będzie uruchamiany w "trybie ścisłym" - pomyłki, które normalnie nie wywołałyby błędu, teraz będą traktowane jak błąd i wyświetlane na czerwono

/* zapisanie "ustawień" skryptu w stałych; prefiks "opt-" (skrót od option) ma odróżniać te stałe */
const optArticleSelector = '.post', //selektor artykułów
  optTitleSelector = '.post-title', //selektor tytułów artykułów
  optTitleListSelector = '.titles', //selektor listy tytułów (linków)
  optArticleTagsSelector = '.post-tags .list', //selektor wybierze nam listę <ul>, w której będą zawarte tagi poszczególnych artykułów
  optArticleAuthorSelector = '.post-author',
  optTagsListSelector = '.list.tags';

/* Display article after click on the proper title-link  ********************************************************************************************************************************************************************************************************************************/
function titleClickHandler(event){ //funkcja, która jest wykonywana w reakcji na event (kliknięcie na link); w argumencie "event" można znaleźć m.in. informacje "target", która zawiera odniesienie do <span>
  console.log('Title was clicked');
  event.preventDefault(); //blokuje mechanizm automatycznego przewijania strony w miejsce wskazanego przez link id (np. do artykułu) oraz zmiany adresu url w skutek kliknięcia na link
  const clickedElement = this; //obiekt "this" wskazuje na element, do którego dodaliśmy "event listener", czyli na link <a>
  /* 1. Remove class 'active' from all article links [DONE] */
  const activeLinks = document.querySelectorAll('.titles a.active');
  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }
  /* 2. Add class 'active' to the clicked link [DONE] */
  clickedElement.classList.add('active');
  /* 3. Remove class 'active' from all articles [DONE] */
  const activeArticles = document.querySelectorAll('.posts article.post.active');
  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }
  /* 4. Get 'href' attribute from the clicked link [DONE] */
  const articleSelector = clickedElement.getAttribute('href'); //przypisanie do stałej "articleSelector" wartości atrybutu "href" pobranej z klikniętego linka
  /* 5. Find the correct article using the selector (href s value) [DONE] */
  const targetArticle = document.querySelector(articleSelector); //przypisanie elementu do stałej "targetArticle" za pomocą funkcji "querySelector", wyszukującej artykuł o danej wartości atrybutu href (zapisanej w stałej "articleSelector")
  /* 6. Add class 'active' to the correct article [DONE] */
  targetArticle.classList.add('active');
}
/****************************************************************************************************************************************************************************************************************************************************************************************/

/* Generate list of article title-links in sidebar-left *********************************************************************************************************************************************************************************************************************************/
function generateTitleLinks(customSelector = ''){
  /* 1. Remove content of titleList [DONE] */
  const titleList = document.querySelector(optTitleListSelector); //znalezienie listy linków-tytułów i przypisanie jej do stałej "titleList"
  function clearMessages(){ //funkcja usuwająca zawartość elementu "titleList" - usuwa wszystkie linki
    titleList.innerHTML = '';
  }
  clearMessages(); //wywołanie funkcji

  /* for each article */
  const articles = document.querySelectorAll(optArticleSelector + customSelector); //znalezienie wszystkich artykułów (zawierających dany tag, którego selektor atrybutu został wysłany dp funkcji jako argument) i zapisanie ich do stałej "articles"
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

  /* kod odpowiedzialny za powiązanie kliknięcia w linki z funkcją "titleClickHandler"
  musimy umieścić za częścią funkcji, która jest odpowiedzialna za tworzenie kodu HTML -
  - najpierw trzeba wygenerować linki, a dopiero potem można przypisywać do nich "event-listenery" */
  const links = document.querySelectorAll('.titles a'); //przypisanie do stałej "links" wszystkich elementów, pasujących do selektora ".titles a", zatem element "links" będzie zawierał jakąś liczbę linków
  for(let link of links){ //przypisanie "event listenerów" do każdego linka zawierającego się w stałej "links" za pomocą pętli
    link.addEventListener('click', titleClickHandler); //powiązanie kliknięcia w link z funkcją "titleClickHandler", inaczej mówiąc: zdarzenie "click" ma wywoływać funkcję "titleClickHandler"
  }
}
/****************************************************************************************************************************************************************************************************************************************************************************************/

generateTitleLinks(); //wywołanie funkcji, która wygeneruje linki na podstawie odniesienia do tytułów zawartych w elementach <article>

/* Generate tags for every article ******************************************************************************************************************************************************************************************************************************************************/
function generateTags(){
  /* [NEW] create a new variable allTags with an empty array */
  let allTags = []; //stworzenie tablicy
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
    for(let tag of articleTagsArray){ //wewnątrz pętli zmienna "tag" będzie treścią pojedynczego taga (np. tag = "cat")
      /* generate HTML of the link */
      const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
      /* add generated code to html variable */
      html = html + linkHTML;
      /* [NEW] check if this link is NOT already in allTags */
      if(allTags.indexOf(linkHTML) == -1){ //sprawdzenie czy dany link (a właściwie jego  kod HTML) znajduje się już w tablicy -
        /* [NEW] add generated code to allTags array [OK] */
        allTags.push(linkHTML); //- jeśli nie (warunek spełniony), to dodajemy go do tablicy
      }
    }/* END LOOP: for each tag */
    /* insert HTML of all the links into the tags wrapper */
    tagsWrapper.innerHTML = html;
  }/* END LOOP: for every article: */
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(optTagsListSelector);
  /* [NEW] add html from allTags to tagList */
  tagList.innerHTML = allTags.join(' '); //dadanie wszystkich linków (pobranych z tablicy) do listy, łącząc je za pomocą spacji
}
/****************************************************************************************************************************************************************************************************************************************************************************************/

generateTags();

/* Add click listener to every tag-link *************************************************************************************************************************************************************************************************************************************************/
/* Mamy pewną liczbę tag-linków (każdy tag może mieć kilka linków, które znajdują się w różnych artykułach), zatem każdemu tag-linkowi musimy nadać event-listenera */
function addClickListenersToTags(){
  /* find all links to tags [DONE] */
  const tagLinks = document.querySelectorAll('a[href^="#tag-"]');

  for(let tagLink of tagLinks){/* START LOOP: for each link */
    /* add tagClickHandler as event listener for that link [DONE] */
    tagLink.addEventListener('click', tagClickHandler);
  }/* END LOOP: for each link */
}
/***************************************************************************************************************************************************************************************************************************************************************************************/

addClickListenersToTags();

/* Add action after tag-links click *****************************************************************************************************************************************************************************************************************************************************/
function tagClickHandler(event){
  console.log('Tag was clicked');
  /* prevent default action for this event [DONE] */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" [DONE] */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element [DONE] */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "tag" and extract (wyodrębnij) tag from the "href" constant [DONE] */
  const tag = href.replace('#tag-', ''); //funkcja "replace" otrzymuje dwa argumenty – szukaną frazę oraz ciąg znaków, którym ma ją zastąpić (dla href = '#tag-cat' otrzymamy samo 'cat')
  /* find all tag links with class active [DONE] */
  const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]'); //znajduje wszystkie aktywne linki tagów z wykorzystaniem selektora atrybutu; łącznik ^= , oznacza "atrybut href zaczynający się od '#tag-'"

  for(let activeTagLink of activeTagLinks){ /* START LOOP: for each active tag link */
    /* remove class active [DONE] */
    activeTagLink.classList.remove('active');
  }/* END LOOP: for each active tag link */

  /* find all tag links with "href" attribute equal to the "href" constant [DONE] */
  const tagLinks = document.querySelectorAll('a[href="' + href + '"]'); //znajduje wszystkie linki tagów z wykorzystaniem selektora atrybutu, które mają taki sam atrybut href, jak kliknięty link
  for(let tagLink of tagLinks){/* START LOOP: for each found tag link */
    /* add class active [DONE] */
    tagLink.classList.add('active');
  }/* END LOOP: for each found tag link */
  /* execute (wywołaj) function "generateTitleLinks" with article selector as argument [DONE] */
  generateTitleLinks('[data-tags~="' + tag + '"]'); //łącznik ~= można odczytać jako "znajdź elementy, które mają atrybut data-tags, który ma w sobie słowo przypisane w 'tag'".
}
/****************************************************************************************************************************************************************************************************************************************************************************************/

/****************************************************************************************************************************************************************************************************************************************************************************************/
function generateAuthors(){
  /* find all articles [DONE] */
  const articles = document.querySelectorAll(optArticleSelector);
  for(let article of articles){
    /* find author wrapper [DONE] */
    const authorWrapper = article.querySelector(optArticleAuthorSelector);
    /* get author from data-author attribute [DONE] */
    const articleAuthor = article.getAttribute('data-author');
    /* generate HTML of the link [DONE] */
    const linkHTML = '<a href="#author-' + articleAuthor + '">' + articleAuthor + '</a>';
    /* insert HTML of the link into the author wrapper [DONE] */
    authorWrapper.innerHTML = linkHTML;
  }
}
/****************************************************************************************************************************************************************************************************************************************************************************************/

generateAuthors();

/****************************************************************************************************************************************************************************************************************************************************************************************/
function addClickListenersToAuthors(){
  /* find all links to authors [DONE] */
  const authorLinks = document.querySelectorAll('a[href^="#author-"]');
  /* add authorClickHandler as event listener for every link [DONE] */
  for(let authorLink of authorLinks){
    authorLink.addEventListener('click', authorClickHandler);
  }
}
/****************************************************************************************************************************************************************************************************************************************************************************************/

addClickListenersToAuthors();

/****************************************************************************************************************************************************************************************************************************************************************************************/
function authorClickHandler(event){
  console.log('Author was clicked');
  /* prevent default action for this event [DONE] */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" [DONE] */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element [DONE] */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "author" and extract tag from the "href" constant [DONE] */
  const author = href.replace('#author-', '');
  /* find all author links with class active [DONE] */
  const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');
  /* Remove class active for each active author link [DONE] */
  for(let activeAuthorLink of activeAuthorLinks){
    activeAuthorLink.classList.remove('active');
  }
  /* find all author links with "href" attribute equal to the "href" constant [DONE] */
  const authorLinks = document.querySelectorAll('a[href="' + href + '"]');
  /* Add class active for each found tag link [DONE] */
  for(let authorLink of authorLinks){
    authorLink.classList.add('active');
  }
  /* execute function "generateTitleLinks" with article selector-attribute as argument [DONE] */
  generateTitleLinks('[data-author="' + author + '"]');
}
/****************************************************************************************************************************************************************************************************************************************************************************************/
