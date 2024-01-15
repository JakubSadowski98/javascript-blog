'use strict'; //kod będzie uruchamiany w "trybie ścisłym" - pomyłki, które normalnie nie wywołałyby błędu, teraz będą traktowane jak błąd i wyświetlane na czerwono

/* zapisanie ustawień skryptu w stałych; skróty: "opts-" od options, "select-" od selector */
const opts = {
  tagSizes: {
    count: 4,
    classPrefix: 'tag-size-',
  },
  authorSizes: {
    count: 2,
    classPrefix: 'author-size-',
  },
};

const select = {
  all: {
    articles: '.post',
    titles: '.post-title',
    linksTo: {
      tags: 'a[href^="#tag-"]',
      authors: 'a[href^="#author-"]',
    },
  },
  article: {
    tags: '.post-tags .list',
    author: '.post-author',
  },
  listOf: {
    titles: '.titles',
    tags: '.list.tags',
    authors: '.list.authors',
  },
};

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
  const titleList = document.querySelector(select.listOf.titles); //znalezienie listy linków-tytułów i przypisanie jej do stałej "titleList"
  function clearMessages(){ //funkcja usuwająca zawartość elementu "titleList" - usuwa wszystkie linki
    titleList.innerHTML = '';
  }
  clearMessages(); //wywołanie funkcji

  /* for each article */
  const articles = document.querySelectorAll(select.all.articles + customSelector); //znalezienie wszystkich artykułów (zawierających dany tag, którego selektor atrybutu został wysłany dp funkcji jako argument) i zapisanie ich do stałej "articles"
  let html = ''; //stworzenie zmiennej (nie stałej!) "html", w której zapiszemy linijki kodu HTML dla linków
  for(let article of articles){ //utworznie pętli do wykonania pozostałych operacji z osobna dla każdego z artykułów
    /* 2. Get the article id [DONE] */
    const articleId = article.getAttribute('id');
    /* 3. Find the title element; get the title from the title element [DONE] */
    const articleTitle = article.querySelector(select.all.titles).innerHTML; //odnalezienie elementu za pomocą "querySelector"; odczytanie zawartości elementu za pomocą "innerHtml"
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

/* Find max and min numbers of tag occurrences ***************************************************************************************************************************************************************************************************************************************************************************************/
function calculateParams(tags){
  const params = {max: 0, min: 999999};
  for(let tag in tags){ //pętla iterująca po obiekcie
    /* 1. sposób: */
    params.max = Math.max(tags[tag], params.max); //wybierze największą liczbę z pośród pary liczb
    params.min = Math.min(tags[tag], params.min); //wybierze najmniejszą liczbę z pośród pary liczb
    /* 2. sposób:
    if(tags[tag] > params.max){
      params.max = tags[tag];
    }
    if(tags[tag] < params.min){
      params.min = tags[tag];
    } */
    /* 3. sposób:
    params.max = tags[tag] > params.max ? tags[tag] : params.max;
    params.min = tags[tag] < params.min ? tags[tag] : params.min; */
  }
  return params;
}
/****************************************************************************************************************************************************************************************************************************************************************************************/

/* Choose class for tag ***************************************************************************************************************************************************************************************************************************************************************************************/
function calculateClass(count, params, cloudClassCount, cloudClassPrefix){
  const normalizedCount = count - params.min; //znormalizowanie liczb - sprawdzenie jak daleko mamy do najmniejszej liczby
  const normalizedMax = params.max - params.min; //zakres pomiędzy najmniejszą, a największą liczbą wystąpień
  const percentage = normalizedCount / normalizedMax; //ustalenie procentu zakresu pomiędzy najmniejszą, a największą liczbą wystąpień
  const classNumber = Math.floor( percentage * (cloudClassCount - 1) + 1); //zastosowanie algorytmu podobnego do losowania liczby całkowitej
  return cloudClassPrefix + classNumber; //np. "tag-size-" + 5 zwraca "tag-size-5"
}
/****************************************************************************************************************************************************************************************************************************************************************************************/

/* Generate tags for every article ******************************************************************************************************************************************************************************************************************************************************/
function generateTags(){
  /* create a new variable allTags with an empty object */
  let allTags = {}; //stworzenie obiektu w celu zliczania wystąpienia tagów
  /* find all articles */
  const articles = document.querySelectorAll(select.all.articles); //stała "articles" jest kolekcją wielu elementów, które zawierają odniesienie do każdego artykułu
  /* START LOOP: for every article: */
  for(let article of articles){ //za pomocą pętli przechodzimy (iterujemy) po kolekcji elementów zawartych w "articles"
    /* find tags wrapper */
    const tagsWrapper = article.querySelector(select.article.tags); //w tej stałej będą umieszczone tagi-linki
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
      /* check if this link is NOT already in allTags */
      if(!allTags.hasOwnProperty(tag)){ //sprawdzenie czy w obiekcie nie istnieje (operator negacji) właściwość o danym kluczu (nazwie)
        /* add tag to allTags object [OK] */
        allTags[tag] = 1; //jeśli warunek spełniony to licznik wystąpień tagu ustawiamy na 1
      } else {
        allTags[tag]++;
      }
    }/* END LOOP: for each tag */
    /* insert HTML of all the links into the tags wrapper */
    tagsWrapper.innerHTML = html;
  }/* END LOOP: for every article: */
  /* find list of tags in right column */
  const tagList = document.querySelector(select.listOf.tags);
  /* [NEW] execute calculateTagParams function with allTags object as argument*/
  const tagsParams = calculateParams(allTags);
  //console.log(tagsParams);
  /* create variable for all links HTML code */
  let allTagsHTML = '';
  /* for each tag in allTags generate code of a link and add it to allTagsHTML */
  for(let tag in allTags){
    allTagsHTML += '<li><a href="#tag-' + tag + '" class="' + calculateClass(allTags[tag], tagsParams, opts.tagSizes.count, opts.tagSizes.classPrefix)  + '">' + tag + '</a></li>';
  }
  /* add html form allTagsHTML to tagList */
  tagList.innerHTML = allTagsHTML;
}
/****************************************************************************************************************************************************************************************************************************************************************************************/

generateTags();

/* Add click listener to every tag-link *************************************************************************************************************************************************************************************************************************************************/
/* Mamy pewną liczbę tag-linków (każdy tag może mieć kilka linków, które znajdują się w różnych artykułach), zatem każdemu tag-linkowi musimy nadać event-listenera */
function addClickListenersToTags(){
  /* find all links to tags [DONE] */
  const tagLinks = document.querySelectorAll(select.all.linksTo.tags);

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
  /* [new] create a new variable allAuthors with an empty object */
  let allAuthors = {}; //stworzenie obiektu w celu zliczania wystąpienia autorów
  /* find all articles [DONE] */
  const articles = document.querySelectorAll(select.all.articles);
  for(let article of articles){
    /* find author wrapper [DONE] */
    const authorWrapper = article.querySelector(select.article.author);
    /* get author from data-author attribute [DONE] */
    const articleAuthor = article.getAttribute('data-author');//np. articleAuthor = Marion Berry
    /* generate HTML of the link [DONE] */
    const linkHTML = '<a href="#author-' + articleAuthor + '">' + articleAuthor + '</a>';
    /* [new] check if this link is NOT already in allAuthors */
    if(!allAuthors.hasOwnProperty(articleAuthor)){ //sprawdzenie czy w obiekcie nie istnieje (operator negacji) właściwość o danym kluczu (nazwie)
      /* add author to allAuthors object [OK] */
      allAuthors[articleAuthor] = 1; //jeśli warunek spełniony to licznik wystąpień autora ustawiamy na 1
    } else {
      allAuthors[articleAuthor]++;
    }
    /* insert HTML of the link into the author wrapper [DONE] */
    authorWrapper.innerHTML = linkHTML;
  }
  /* [NEW] find list of authors in right column */
  const authorList = document.querySelector(select.listOf.authors);
  /* [NEW] execute calculateTagParams function with allAuthors object as argument*/
  const authorsParams = calculateParams(allAuthors);
  /* [NEW] create variable for all links HTML code */
  let allAuthorsHTML = '';
  /* [NEW] for each author in allAuthors generate code of a link and add it to allAuthorsHTML */
  for(let author in allAuthors){
    allAuthorsHTML += '<li><a href="#author-' + author + '" class="' + calculateClass(allAuthors[author], authorsParams, opts.authorSizes.count, opts.authorSizes.classPrefix)  + '">' + author + '</a></li>';
  }
  /* [NEW]add html form allTagsHTML to tagList */
  authorList.innerHTML = allAuthorsHTML;
}
/****************************************************************************************************************************************************************************************************************************************************************************************/

generateAuthors();

/****************************************************************************************************************************************************************************************************************************************************************************************/
function addClickListenersToAuthors(){
  /* find all links to authors [DONE] */
  const authorLinks = document.querySelectorAll(select.all.linksTo.authors);
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
