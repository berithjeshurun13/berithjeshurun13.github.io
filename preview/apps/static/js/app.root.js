let typedInstances = {}; // Use an object to manage instances by element ID
// Loader 
window.addEventListener("load", () => {
    const loader = document.querySelector("#loader");
    loader.style.display = "none";

    // Display the first tab content by default
    document.getElementsByClassName("tab-content")[0].style.display = "block";
});

document.addEventListener("click", () => {
    AlwaysRunBeforeDoingSomething();
})

function AlwaysRunBeforeDoingSomething() {
    document.getElementById("previewBox").style.display = "none";
    
}

// Utility functions
function getTab_bible_BOOK() {
    AlwaysRunBeforeDoingSomething();
    return document.getElementById('_tab_book_browse').value;
}

function closeTabs_() {
    AlwaysRunBeforeDoingSomething();
    const tabContent = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
        tabContent[i].classList.remove("active");
    }
    const tabLinks = document.getElementsByClassName("tablink");
    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].classList.remove("active");
    }
}

function openSmartNotes() {
    AlwaysRunBeforeDoingSomething();
    document.getElementsByClassName("smartnotes")[0].style.display = "block";
    
}

function closeSmartNotes() {
    AlwaysRunBeforeDoingSomething();
    document.getElementsByClassName("smartnotes")[0].style.display = "none";
    if (window.innerWidth <= 768) {
        document.getElementById("smartnotes_mobile").style.display = "none";
        document.getElementById("left-panel-swipe").style.display = "none";
        document.getElementById("right-panel-swipe").style.display = "block";
    } 
}

function showToast(message, typ) {
    AlwaysRunBeforeDoingSomething();
    const toast = document.getElementById("toast");
    toast.innerText = message;
    toast.className = "show";
    if (typ == 'E') {
        toast.classList.add("error");
    } else if (typ == 'I') {
        toast.classList.add("info");
    } else if (typ == 'S') {
        toast.classList.add("success");
    } else if (typ == 'W') {
        toast.classList.add("warning");
    }
    setTimeout(() => {
        toast.className = toast.className.replace("show", "");
    }, 5000); // Toast disappears after 5 seconds
}

function saveNotes() {
    AlwaysRunBeforeDoingSomething();
    closeSmartNotes();
    showToast("Successfully saved notes", "S");
}

async function fetchVerse(func, book, chapter, verse) {
    AlwaysRunBeforeDoingSomething();
    const url = `/api.seed.io/getVerse/${func}/${book}/${chapter}/${verse}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error fetching Bible verse:", error);
        showToast("Error fetching verse", "E");
        return null;
    }
}

async function fetchMeaning(topic) {
    AlwaysRunBeforeDoingSomething();
    try {
        const response = await fetch(`/api.seed.io/?word=${encodeURIComponent(topic)}`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch error:", error);
        showToast("Error fetching data", "E");
        return null;
    }
}

async function getVerseProperty() {
    AlwaysRunBeforeDoingSomething();
    let bookName = document.getElementById('_tab_book_browse');
    let Chaps = document.getElementById('_tab_chapter_browse');
    let Verses = document.getElementById('_tab_verse_browse');
    const url = `/api.seed.io/getProperty/${bookName.value}/${Chaps.value}`;

    for (let i = Verses.options.length - 1; i > 0; i--) {
        Verses.remove(i);
    }

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();

        if (data && Array.isArray(data)) {
            data.forEach(verse => {
                const option = document.createElement('option');
                option.value = verse;
                option.textContent = verse;
                Verses.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Error fetching Bible verse:", error);
    }
}

async function getBookProperty() {
    AlwaysRunBeforeDoingSomething();
    let bookName = document.getElementById('_tab_book_browse');
    let Chaps = document.getElementById('_tab_chapter_browse');
    const url = `/api.seed.io/getProperty/${bookName.value}`
    for (let i = Chaps.options.length - 1; i > 0; i--) {
        Chaps.remove(i);
    }
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        if (data && Array.isArray(data)) {
            data.forEach(chapter => {
                const option = document.createElement('option');
                option.value = chapter;
                option.textContent = `Chapter ${chapter}`;
                Chaps.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Error fetching Bible verse:", error);
    }
}

function deactivate_tabs() {
    const tabContent = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
        tabContent[i].classList.remove("active");
    }

    const tabLinks = document.getElementsByClassName("tablink");
    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].classList.remove("active");
    }
    return
}

function copyInnerText(object__) {
    const textToCopy = object__.innerText;

    // Check if Clipboard API is available
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                console.log("Text copied to clipboard!");
            })
            .catch(err => {
                console.error("Failed to copy text: ", err);
            });
    } else {
        // Fallback to using a hidden textarea
        fallbackCopyTextToClipboard(textToCopy);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Make it off-screen and unselectable
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);

    textArea.select();
    try {
        document.execCommand("copy");
    } catch (err) {
        console.error("Fallback: Could not copy text", err);
    }

    document.body.removeChild(textArea);
}

async function generateDSC(FUNC, bookName, Chaps, Verses) {
    AlwaysRunBeforeDoingSomething();
    console.log(`FUNC : ${FUNC}`);
    console.log(`Book Name : ${bookName}`);
    console.log(`Chapter : ${Chaps}`);
    console.log(`Verse : ${Verses}`);
    const url = `/api.seed.io/?wordsummary=${bookName}_${Chaps}:${Verses}&book=${bookName}&func=${FUNC}&chapter=${Chaps}&verse=${Verses}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        if (data) {
            console.log(data);
            if (window.innerWidth <= 768) {
                document.getElementById("left-panel-swipe").style.display = "none";
                document.getElementById("right-panel-swipe").style.display = "flex";
            } 
            const tit = document.getElementById('result_title');
            tit.innerText = data.title.toUpperCase().replace(/'S/g, "'s");;
            SpawnText('typed-paragraph', data.html);
            addPreviewListener();
            
        }
    } catch (error) {
        console.error("Error fetching Bible verse:", error);
    }
}


async function getVerse() {
    AlwaysRunBeforeDoingSomething();
    const element = document.getElementById('doc_generate_bible_comment');
    if (element) {
        element.remove();
    } else {
        console.warn("Element with ID 'doc_generate_bible_comment' not found.");
    }
    let title = document.getElementById("_tab_BIBLE_title");
    let description = document.getElementById("_tab_BIBLE_description");
    let bookName = document.getElementById('_tab_book_browse');
    let Chaps = document.getElementById('_tab_chapter_browse');
    let Verses = document.getElementById('_tab_verse_browse');
    let TAB_BIBLE = document.getElementById("TAB_BIBLE");
    let FUNC = document.getElementById("_tab_standard_browse");
    const paragraphs = TAB_BIBLE.querySelectorAll('p');

    paragraphs.forEach(paragraph => {
        if (paragraph.id !== '_tab_BIBLE_description') {
            paragraph.remove();
        }
    });
    data = await fetchVerse(FUNC.value, bookName.value, Chaps.value, Verses.value);
    title.innerText = `${bookName.value} ${Chaps.value}`;
    description.innerText = data.events;
    if (data && Array.isArray(data.verse)) {
        data.verse.forEach(verse => {
            const option = document.createElement('p');
            option.innerText = verse;
            option.onclick = () => copyInnerText(option);
            TAB_BIBLE.appendChild(option);
        });
        const butt = document.createElement('button');
        butt.classList.add('button-2');
        butt.classList.add('btn-grn');
        butt.classList.add('btn-bubbleClick');
        butt.textContent = "Generate";
        butt.id = 'doc_generate_bible_comment'
        // butt.onclick = () => generateDSC(FUNC.value, bookName.value, Chaps.value, Verses.value);
        butt.onclick = function (ev) {
            let bookName = document.getElementById('_tab_book_browse');
            let Chaps = document.getElementById('_tab_chapter_browse');
            let Verses = document.getElementById('_tab_verse_browse');
            let FUNC = document.getElementById("_tab_standard_browse");
            generateDSC(FUNC.value, bookName.value, Chaps.value, Verses.value);
            // ev.preventDefault();
        }
        // <button class="button-2 btn-grn btn-bubbleClick">GENERATE</button>
        TAB_BIBLE.appendChild(butt);
    }
}

// document.getElementById('doc_generate_bible_comment').onclick = function() {
//     let bookName = document.getElementById('_tab_book_browse');
//     let Chaps = document.getElementById('_tab_chapter_browse');
//     let Verses = document.getElementById('_tab_verse_browse');
//     let FUNC = document.getElementById("_tab_standard_browse");
//     generateDSC(FUNC.value, bookName.value, Chaps.value, Verses.value);
// }


function openTab(event, tabName) {
    AlwaysRunBeforeDoingSomething();
    // Get all tab content elements and hide them
    const tabContent = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
        tabContent[i].classList.remove("active");
    }
    // Get all tab buttons and remove the "active" class
    const tabLinks = document.getElementsByClassName("tablink");
    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].classList.remove("active");
    }
    deactivate_tabs();
    // Show the selected tab and add "active" class to the clicked button
    document.getElementById(tabName).style.display = "block";
    document.getElementById(tabName).classList.add("active");
    if (event != null) {
        event.currentTarget.classList.add("active");
    }else {
        const sss = document.getElementById(tabName);
        if (sss != null) {
            sss.classList.add("active");
        }
    }

}

// document.getElementById("preview-link").addEventListener('mouseenter', () => {
//     const previewBox = document.getElementById("previewBox");
//     const previewTitle = document.getElementById("previewTitle");
//     const previewContent = document.getElementById("previewContent");
//     const previewLink = document.getElementById("preview-link");
//     const previewImg = document.getElementById("previewImg");
//     const previewTag = document.getElementById("previewTag");
//     if (previewLink) {
//         previewLink.forEach(item => {
//             item.addEventListener("mouseenter", async () => {
//                 const topic = item.innerText.trim();
//                 alert("Hovered");
//                 data = await fetchMeaning(topic);
//                 if (data != null) {
//                     previewTitle.textContent = data.title;
//                     previewContent.textContent = data.description;
//                     previewImg.src = data.image;
//                     previewTag.innerText = data.tag;
//                     const rect = item.getBoundingClientRect();
//                     previewBox.style.left = `${rect.right + window.scrollX + 10}px`;
//                     previewBox.style.top = `${rect.top + window.scrollY}px`;
//                     previewBox.style.display = "block";
//                 }
//                 else {
//                     previewBox.style.display = "none";
//                     showToast("Error fetching data from server", "E");
//                 }
//             });
//             item.addEventListener("mouseleave", () => {
//                 previewBox.style.display = "none";
//             });
//         });
//     }
    
    // if (previewLink) {
    //     previewLink.addEventListener("mouseenter", async () => {
    //         const topic = previewLink.innerText.trim();
    //         alert("Hovered");
    //         data = await fetchMeaning(topic);
    //         if (data != null) {
    //             previewTitle.textContent = data.title;
    //             previewContent.textContent = data.description;
    //             previewImg.src = data.image;
    //             previewTag.innerText = data.tag;
    //             const rect = previewLink.getBoundingClientRect();
    //             previewBox.style.left = `${rect.right + window.scrollX + 10}px`;
    //             previewBox.style.top = `${rect.top + window.scrollY}px`;
    //             previewBox.style.display = "block";
    //         }
    //         else {
    //             previewBox.style.display = "none";
    //             showToast("Error fetching data from server", "E");
    //         }
    //     });

    //     previewLink.addEventListener("mouseleave", () => {
    //         previewBox.style.display = "none";
    //     });
    // }
// }); 

function addPreviewListener() {
    const previewBox = document.getElementById("previewBox");
    const previewTitle = document.getElementById("previewTitle");
    const previewContent = document.getElementById("previewContent");
    const previewLink = document.querySelectorAll("#preview-link");
    const previewImg = document.getElementById("previewImg");
    const previewTag = document.getElementById("previewTag");
    if (previewLink) {
        
        console.log(previewLink);
        previewLink.forEach(item => {
            
            item.addEventListener("mouseenter", async () => {
                const topic = item.innerText.trim();
                data = await fetchMeaning(topic);
                if (data != null) {
                    previewTitle.textContent = data.title;
                    previewContent.innerHTML = data.description;
                    previewImg.src = data.image;
                    previewTag.innerText = data.tag;
                    const rect = item.getBoundingClientRect();
                    previewBox.style.left = `${rect.right + window.scrollX + 10}px`;
                    previewBox.style.top = `${rect.top + window.scrollY}px`;
                    previewBox.style.display = "block";
                }
                else {
                    previewBox.style.display = "none";
                    showToast("Error fetching data from server", "E");
                }
            });
            item.addEventListener("mouseleave", () => {
                previewBox.style.display = "none";
            });
        });
    }
    // if (previewLink) {
    //     previewLink.addEventListener("mouseenter", async () => {
    //         const topic = previewLink.innerText.trim();
    //         alert("Hovered");
    //         data = await fetchMeaning(topic);
    //         if (data != null) {
    //             previewTitle.textContent = data.title;
    //             previewContent.textContent = data.description;
    //             previewImg.src = data.image;
    //             previewTag.innerText = data.tag;
    //             const rect = previewLink.getBoundingClientRect();
    //             previewBox.style.left = `${rect.right + window.scrollX + 10}px`;
    //             previewBox.style.top = `${rect.top + window.scrollY}px`;
    //             previewBox.style.display = "block";
    //         }
    //         else {
    //             previewBox.style.display = "none";
    //             showToast("Error fetching data from server", "E");
    //         }
    //     });

    //     previewLink.addEventListener("mouseleave", () => {
    //         previewBox.style.display = "none";
    //     });
    // }

}


// Initialize a variable to hold the Typed.js instance


function SpawnText(element_id, html) {
    AlwaysRunBeforeDoingSomething();
    // Check if an instance already exists for the given element ID
    if (typedInstances[element_id]) {
        typedInstances[element_id].destroy(); // Destroy the existing instance
    }
    

    // Create a new instance of Typed.js
    typedInstances[element_id] = new Typed(`#${element_id}`, {
        strings: [html],
        typeSpeed: 1,
        startDelay: 250,
        backSpeed: 1,
        smartBackspace: true,
        loop: false,
        showCursor: false,
        fadeOut : true,

        contentType: 'html', // This will preserve the HTML tags like <a>
        onComplete: addPreviewListener,
        
    });
}


function TypeText(element_id, html) {
    AlwaysRunBeforeDoingSomething();
    if (typedInstances[element_id]) {
        typedInstances[element_id].destroy();
    }
    

    typedInstances[element_id] = new Typed(`#${element_id}`, {
        strings: [html],
        typeSpeed: 2,
        startDelay: 250,
        backSpeed: 13,
        smartBackspace: true,
        loop: false,
        showCursor: true,
        contentType: 'html',
    });
}

async function selectSuggestion(suggestion, object_, data = null, unchange = false) {
    AlwaysRunBeforeDoingSomething();
    const inpu = document.getElementById('user-input');
    document.getElementById('suggestions').style.display = 'none';
    document.getElementById('suggesstions_for_tabMeanings').style.display = 'none';
    const inpu_MEANING = document.getElementById("_tab_MEANING_input");
    switch (object_) {
        case "STORY":
            inpu.value = `Story of ${suggestion}`;
            break;
        case "MEANING":
            data = await fetchMeaning(suggestion);
            closeTabs_();
            if (unchange == false) {
                inpu.value = `Meaning of ${suggestion}`;
                inpu_MEANING.value = suggestion;
            }
            document.getElementById("Tab3").classList.add("active");
            document.getElementById("Tab3").style.display = "block";
            if (window.innerWidth <= 768) {
                document.getElementById("left-panel-swipe").style.display = "flex";
                document.getElementById("right-panel-swipe").style.display = "none";
            } 
            inpu_MEANING.value = suggestion;
            SpawnText("_tab_MEANING_title", data.title);
            SpawnText("_tab_MEANING_description", data.description);
            
            break;
        default:
            break;
    }
}

async function fetchSuggestions_(object_, query) {
    AlwaysRunBeforeDoingSomething();
    if (query.length < 1) {
        document.getElementById('suggestions').style.display = 'none';
        return;
    }
    fetch(`/api.seed.io/getEntrySuggestions/?object=${object_}&query=${query}`)
        .then(response => response.json())
        .then(data => {
            const suggestions = document.getElementById('suggestions');
            suggestions.innerHTML = '';
            data.forEach(suggestion => {
                const div = document.createElement('div');
                div.className = 'suggestion-item';
                div.innerText = suggestion;
                div.onclick = () => selectSuggestion(suggestion, object_);
                suggestions.appendChild(div);
            });
            suggestions.style.display = data.length > 0 ? 'block' : 'none';
        });
}

async function fetchSugg_T_M(userInput) {
    AlwaysRunBeforeDoingSomething();
    try {
        const response = await fetch(`/api.seed.io/getEntrySuggestions/?object=MEANING&query=${userInput}`);
        if (!response.ok) throw new Error("Network response was not ok");
        
        const data = await response.json();
        const suggestions = document.getElementById('suggesstions_for_tabMeanings');
        suggestions.innerHTML = '';
        
        data.forEach(suggestion => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.innerText = suggestion;
            div.onclick = () => selectSuggestion(suggestion, "MEANING", null, true);
            suggestions.appendChild(div);
        });
        
        suggestions.style.display = data.length > 0 ? 'block' : 'none';
    } catch (error) {
        console.error("Error fetching suggestions:", error);
    }
}



document.getElementById('_tab_MEANING_input').addEventListener('keyup', function (event) {
    AlwaysRunBeforeDoingSomething();
    document.getElementById('suggesstions_for_tabMeanings').style.display = 'none';
    if (event.target.value.length > 0) {
        const userInput = event.target.value;
        fetchSugg_T_M(userInput);
    }
    
    
})

document.getElementById('user-input').addEventListener('keyup', async function (event) {
    AlwaysRunBeforeDoingSomething();
    const userInput = event.target.value;
    if (userInput.endsWith('/ref ')) {
        console.log("References Selector");
    }
    // else if (userInput.endsWith("Story of ")) {
    //     // alert("Story of " + userInput);
    //     console.log("Fecting Suggestions for Story")
    //     fetchSuggestions_("STORY", userInput)
    // } else if (userInput.startsWith("Story of ")) {
    //     query = userInput.replace("Story of ", "");
    //     fetchSuggestions_("STORY", query)
    // } else if (userInput.endsWith("Meaning of ")) {
    //     console.log("Fecting Suggestions for Story")
    //     fetchSuggestions_("MEANING", userInput)
    // } else if (userInput.startsWith("Meaning of ")) {
    //     query = userInput.replace("Meaning of ", "");
    //     fetchSuggestions_("MEANING", query)
    // } else if (userInput.startsWith("Explain from ")) {
    //     query = userInput.replace("Explain ", "");
    // }
});

function ToggleControlPanel() {
    const controlPanel = document.getElementById('controlPanel');
    if (controlPanel.style.display == 'block') {
        controlPanel.style.display = 'none';
    }else {
        controlPanel.style.display = 'block'
    }
}










// SHould Developed

/* onload : WorkSpace kickstart

window.addEventListener("load", () => {
    const title = document.getElementById("result_title");
    fetch(`/api.seed.io/?job=boot&params=today`)
        .then(response => response.json())
        .then(data => {
            title.innerText = data.title;
        });
});
*/