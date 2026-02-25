var instances = null;
var should_i_fetch = false;
var all_instances = [];


function rm_elems(element) {
    for (let i = element.options.length - 1; i > 0; i--) {
        element.remove(i);
    }
    return;
}

function rm_divs(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
    return;

}

async function fetchBibles() {
    try {

        const response = await fetch(`/api.insight.ai/bible/?job=standard`);
        if (!response.ok) {
            throw new Error("Error Fetching Bible Data");
        }
        const data = await response.json();
        const box = document.getElementById('_tab_standard_browse');
        rm_elems(box);
        if (data.status == true) {
            array = data.data;
            array.forEach(standard => {
                option = document.createElement('option');
                option.value = standard;
                option.text = standard;
                box.appendChild(option);
            });
        }
    } catch (error) {
        showToast("This is a Demo", "E");
    }
}

async function api_get_bible_books() {
    try {
        standard = document.getElementById('_tab_standard_browse').value;
        const response = await fetch(`/api.insight.ai/bible/?job=book&standard=${encodeURIComponent(standard)}`);
        if (!response.ok) {
            throw new Error("Error Fetching Bible Data");
        }
        const data = await response.json();
        const box = document.getElementById('_tab_book_browse');
        if (data.status == true) {
            rm_elems(box);
            array = data.data;
            array.forEach(standard => {
                option = document.createElement('option');
                option.value = standard;
                option.text = standard;
                box.appendChild(option);
            });
        } else {
            showToast("No Books Found for the Selected Standard", "E");
            rm_elems(box);
            const option = document.createElement('option');
            option.value = '0';
            option.text = 'No Books Available';
            box.appendChild(option);
            console.log(data);
        }
    } catch (error) {
        showToast("This is a Demo", "E");
    }
}

async function api_get_bible_chapters() {
    try {
        const standard = document.getElementById('_tab_standard_browse').value;
        const book = document.getElementById('_tab_book_browse').value;
        const response = await fetch(`/api.insight.ai/bible/?job=chapter&standard=${standard}&book=${book}`);
        if (!response.ok) {
            throw new Error("Error Fetching Bible Data");
        }
        const data = await response.json();
        const box = document.getElementById('_tab_chapter_browse');
        if (data.status == true) {
            rm_elems(box);
            array = data.data;
            array.forEach(standard => {
                option = document.createElement('option');
                option.value = standard;
                option.text = standard;
                box.appendChild(option);
            });
        }
    } catch (error) {
        showToast("This is a Demo", "E");
    }
}

async function api_get_bible_verses() {
    try {
        const standard = document.getElementById('_tab_standard_browse').value;
        const book = document.getElementById('_tab_book_browse').value;
        const chapter = document.getElementById('_tab_chapter_browse').value;
        const response = await fetch(`/api.insight.ai/bible/?job=verse&standard=${standard}&book=${book}&chapter=${chapter}`);
        if (!response.ok) {
            throw new Error("Error Fetching Bible Data");
        }
        const data = await response.json();
        const box = document.getElementById('_tab_verse_browse');
        if (data.status == true) {
            rm_elems(box);
            array = data.data;
            array.forEach(standard => {
                option = document.createElement('option');
                option.value = standard;
                option.text = standard;
                box.appendChild(option);
            });
        }
    } catch (error) {
        showToast("This is a Demo", "E");
    }
}


async function setMeanings(params, checks) {
    // for (let [key, value] of params) {
    //     const meanbox = document.createElement('div');
    //     meanbox.className = 'meanbox';
    //     const content = document.createElement('div');
    //     content.className = 'meanbox-content';
    //     const mbx = document.createElement('div');
    //     console.log(key, value);
    // }
    rm_divs(document.getElementById('_tab_bible_meanings_container'));
    params.forEach((obj, index) => {
        const _tab_bible_meanings = document.getElementById('_tab_bible_meanings_container');
        for (const [key, value] of Object.entries(obj)) {
            if (key != '' && value != '') {
                const meanbox = document.createElement('div');
                meanbox.className = 'meanbox';
                const content = document.createElement('div');
                content.className = 'meanbox-content';
                const mbx = document.createElement('div');
                const mbx2 = document.createElement('div');
                if (key in checks) {
                    if (checks[key].includes('Person')) {
                        mbx.className = `mbx-P person`;
                        mbx.textContent = 'PE';
                    }
                    if (checks[key].includes('Place')) {
                        mbx2.className = `mbx-P place`;
                        mbx2.textContent = 'PL';

                    }
                }
                content.appendChild(mbx);
                content.appendChild(mbx2);
                const h2 = document.createElement('h2');
                h2.textContent = key;
                content.appendChild(h2);
                meanbox.appendChild(content);
                const p = document.createElement('p');
                p.textContent = value;
                meanbox.appendChild(p);
                _tab_bible_meanings.appendChild(meanbox);
                _tab_bible_meanings.appendChild(document.createElement('hr'));
            }
        }
    });

    // <div class="meanbox">
    //     <div class="meanbox-content">
    //         <div class="mbx-P person">PE</div>
    //         <h2>Adam</h2>
    //     </div>
    //     <p>First man</p>
    // </div>
}

function generateId(prefix = "id") {
    return `${prefix}-${Math.random().toString(36).slice(2, 11)}`;
}


async function generate_instances(onHold = false) {
    if (instances != null) {
        const instancesTab = document.getElementById('instances-tab');
        if (onHold != true) {
            rm_divs(instancesTab);
        }
        instances.forEach(key => {
            const instanceDiv = document.createElement('div');
            instanceDiv.className = 'instance';
            const h3 = document.createElement('h3');
            h3.textContent = key;
            h3.dataset.query = key;
            const fullText = h3.textContent.trim();
            if (fullText.length > 20) {
                h3.textContent = fullText.slice(0, 20) + " ...";
            }
            instanceDiv.appendChild(h3);
            const button = document.createElement('button');
            button.innerHTML = '<img src="/static/svg/close.svg" alt="Remove Instance">';
            button.onclick = function (e) {
                e.stopPropagation();
                instanceDiv.remove();
            };
            instanceDiv.onclick = async function () {
                for (const ins in typedInstances) {
                    try {
                        typedInstances[ins].destroy();
                    } catch (error) {

                    }
                }
                typedInstances = {}
                document.querySelectorAll('.instance').forEach(element => {
                    if (element.classList.contains('active')) { element.classList.remove('active') }
                });
                const query = this.querySelector('h3').dataset.query;
                const response = await fetch(`/api.insight.ai/instances/?query=${encodeURIComponent(query)}`);
                if (!response.ok) {
                    showToast("Error Fetching Instance Data", "E");
                    return;
                }

                const data = await response.json();
                if (data.status == true) {
                    if (ON_PHONE == true) {
                        toggleDiv.style.display = "none";
                        tDiv2.style.display = "flex";
                        isDivVisible = false;
                        history.back();
                    }
                    const generative = document.getElementById('generated-content');
                    rm_divs(generative);
                    SpawnText('generated-content', data.data);
                    const result_title = document.getElementById('result_title');
                    result_title.innerText = query;
                    this.classList.add('active');
                }
            }
            instanceDiv.appendChild(button);
            instancesTab.appendChild(instanceDiv);
        });
        instances = null;
    }
}
async function fetch_verse() {
    const standard = document.getElementById('_tab_standard_browse').value;
    const book = document.getElementById('_tab_book_browse').value;
    const chapter = document.getElementById('_tab_chapter_browse').value;
    const verse = document.getElementById('_tab_verse_browse').value;
    try {
        const response = await fetch(`/api.insight.ai/bible/?job=lookup&standard=${encodeURIComponent(standard)}&book=${encodeURIComponent(book)}&chapter=${encodeURIComponent(chapter)}&verse=${encodeURIComponent(verse)}`)
        if (!response.ok) {
            throw new Error("Error Fetching Bible Data");
        }
        const data = await response.json();
        if (data.status == true) {
            document.getElementById('_tab_BIBLE_title').innerText = `${book} ${chapter}`;
            document.getElementById('_tab_BIBLE_description').innerText = data.title;
            const _tab_bible_verses = document.getElementById('_tab_bible_verses');
            _tab_bible_verses.querySelectorAll('p').forEach(element => {
                element.remove();
            });
            console.info(data);
            if (data.status == true) {
                if (verse != '0') {
                    document.getElementById('_tab_BIBLE_title').innerText = `${book} ${chapter}:${verse}`;
                    array = data.data;
                    array.forEach(v => {
                        const p = document.createElement('p');
                        p.innerText = `${verse}. ${v}`;
                        _tab_bible_verses.appendChild(p);
                    });
                } else {
                    array = data.data[0];
                    array.forEach(v => {
                        const p = document.createElement('p');
                        p.innerText = v;
                        _tab_bible_verses.appendChild(p);
                    });
                }
                instances = data.instances;
                await generate_instances();
                await setMeanings(data.meanings, data.tokens);
            }
        }
    } catch (error) {
        showToast("This is a Demo", "E");
        const _tab_bible_verses = document.getElementById('_tab_bible_verses');
        _tab_bible_verses.querySelectorAll('p').forEach(element => {
            element.remove();
        });
        const genesis1_kjv = [
            "In the beginning God created the heaven and the earth.",
            "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.",
            "And God said, Let there be light: and there was light.",
            "And God saw the light, that it was good: and God divided the light from the darkness.",
            "And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.",
            "And God said, Let there be a firmament in the midst of the waters, and let it divide the waters from the waters.",
            "And God made the firmament, and divided the waters which were under the firmament from the waters which were above the firmament: and it was so.",
            "And God called the firmament Heaven. And the evening and the morning were the second day.",
            "And God said, Let the waters under the heaven be gathered together unto one place, and let the dry land appear: and it was so.",
            "And God called the dry land Earth; and the gathering together of the waters called he Seas: and God saw that it was good.",
            "And God said, Let the earth bring forth grass, the herb yielding seed, and the fruit tree yielding fruit after his kind, whose seed is in itself, upon the earth: and it was so.",
            "And the earth brought forth grass, and herb yielding seed after his kind, and the tree yielding fruit, whose seed was in itself, after his kind: and God saw that it was good.",
            "And the evening and the morning were the third day.",
            "And God said, Let there be lights in the firmament of the heaven to divide the day from the night; and let them be for signs, and for seasons, and for days, and years:",
            "And let them be for lights in the firmament of the heaven to give light upon the earth: and it was so.",
            "And God made two great lights; the greater light to rule the day, and the lesser light to rule the night: he made the stars also.",
            "And God set them in the firmament of the heaven to give light upon the earth,",
            "And to rule over the day and over the night, and to divide the light from the darkness: and God saw that it was good.",
            "And the evening and the morning were the fourth day.",
            "And God said, Let the waters bring forth abundantly the moving creature that hath life, and fowl that may fly above the earth in the open firmament of heaven.",
            "And God created great whales, and every living creature that moveth, which the waters brought forth abundantly, after their kind, and every winged fowl after his kind: and God saw that it was good.",
            "And God blessed them, saying, Be fruitful, and multiply, and fill the waters in the seas, and let fowl multiply in the earth.",
            "And the evening and the morning were the fifth day.",
            "And God said, Let the earth bring forth the living creature after his kind, cattle, and creeping thing, and beast of the earth after his kind: and it was so.",
            "And God made the beast of the earth after his kind, and cattle after their kind, and every thing that creepeth upon the earth after his kind: and God saw that it was good.",
            "And God said, Let us make man in our image, after our likeness: and let them have dominion over the fish of the sea, and over the fowl of the air, and over the cattle, and over all the earth, and over every creeping thing that creepeth upon the earth.",
            "So God created man in his own image, in the image of God created he him; male and female created he them.",
            "And God blessed them, and God said unto them, Be fruitful, and multiply, and replenish the earth, and subdue it: and have dominion over the fish of the sea, and over the fowl of the air, and over every living thing that moveth upon the earth.",
            "And God said, Behold, I have given you every herb bearing seed, which is upon the face of all the earth, and every tree, in the which is the fruit of a tree yielding seed; to you it shall be for meat.",
            "And to every beast of the earth, and to every fowl of the air, and to every thing that creepeth upon the earth, wherein there is life, I have given every green herb for meat: and it was so.",
            "And God saw every thing that he had made, and, behold, it was very good. And the evening and the morning were the sixth day."
        ];
        var c = 1;
        genesis1_kjv.forEach(v => {
            const p = document.createElement('p');
            p.innerText = `${c}. ${v}`;
            _tab_bible_verses.appendChild(p);
            c = c + 1;
        });

    }


}

document.addEventListener("DOMContentLoaded", async () => {
    await fetchBibles();

    document.getElementById('user-input').addEventListener('keydown', async (e) => {
        const userInput = e.target.value;
        if (e.key == 'Enter') {
            try {
                const response = await fetch(`/api.insight.ai/search?query=${encodeURIComponent(userInput)}`);
                const data = await response.json();

                if (!response.ok) {
                    showToast("Cant Fetch Data", 'E');
                }

                if (data.status == true) {
                    instances = data.data
                    await generate_instances(true);
                    if (ON_PHONE == true) {
                        toggleDiv.style.display = "flex";
                        tDiv2.style.display = "none";
                        isDivVisible = true;
                        pushHistory();
                    }
                    openTab(null, 'Tab2');
                }
            } catch (error) {
                showToast("This is a Demo", "E");
                console.warn(error);
            }
        }
    });

    document.getElementById('btn-send-message').onclick = async () => {
        const userInput = document.getElementById('user-input').value;
        try {
            const response = await fetch(`/api.insight.ai/search?query=${encodeURIComponent(userInput)}`);
            const data = await response.json();

            if (!response.ok) {
                showToast("Cant Fetch Data", 'E');
            }

            if (data.status == true) {
                instances = data.data
                await generate_instances(true);
                if (ON_PHONE == true) {
                    toggleDiv.style.display = "flex";
                    tDiv2.style.display = "none";
                    isDivVisible = true;
                    pushHistory();
                }
                openTab(null, 'Tab2');
            }
        } catch (error) {
            showToast("This is a Demo", "E");
            console.warn(error);
        }
    }

});


