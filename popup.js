

/**
 * Generate a hexadecimal string from binary data.
 * 
 * @param {ArrayBuffer} buffer 
 * @returns {string}
 */
function toHex(buffer) {
    let b = Array.from(new Uint8Array(buffer)).reverse()
    return b.map(x => (x >> 4).toString(16) + (x & 0xF).toString(16)).join("")
}


/**
 * Generate a base64 string from binary data.
 * @param {ArrayBuffer} buffer 
 * @returns {string}
 */
function toBase64(buffer) {
    let b = Array.from(new Uint8Array(buffer)).reverse()
    return btoa(b.map(x => String.fromCharCode(x)).join(""))
}


/**
 * Generate a password from a username, website and master password.
 * @param {string} username 
 * @param {string} website 
 * @param {string} master_password 
 * @returns {string} The generated passsword
 */
function generate(username, website, master_password) {
    let h = sjcl.hash.sha256.hash(username + website + master_password)
    let data = new Int32Array(h).reverse()

    let b64 = toBase64(data.buffer)
    return b64
}


/**
 * Update the password based on the fields.
 */
function update() {
    let username = usernameInput.value
    let website = websiteInput.value
    let password = passwordInput.value
    let index = indexInput.value

    if (username == "" || website == "" || password == "") {
        document.getElementById("hash").value = ""
        return    
    }
    
    let hashed = generate(username + index, website, password)
    
    document.getElementById("hash").value = hashed
}


/**
 * Copy the current generated password to the clipboard.
 */
function copyPassword() {
    navigator.clipboard.writeText(document.getElementById("hash").value)
}


/**
 * Fills in a password field on the website with the generated password.
 */
function fillInField() {
    let password = document.getElementById("hash").value

    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {"message": password})
    })
}

/**
 * Get data from chromes sync storage.
 * @param {string} key 
 * @returns {*}
 */
async function getStorageSync(key)  {
    return new Promise(res => chrome.storage.sync.get(key, data => res(data[key])))
}

/**
 * Save the current login information to the sync storage (excluding the password of course)
 */
async function save() {
    let newLogin = {
        username: usernameInput.value,
        website: websiteInput.value,
        domains: [psl.get(hostname)],
        index: indexInput.value
    }

    let logins = await getStorageSync("logins")

    let merged = false
    for (let login of logins) {
        if (newLogin.username == login.username && newLogin.website == login.website) {
            // Update if website is already in storage
            if (!login.domains.includes(newLogin.domains[0])) {
                login.domains.push(newLogin.domains[0])
            }
            login.index = newLogin.index
            merged = true
            break
        }
    }
    
    if (!merged) {
        logins.push(newLogin)
    }

    chrome.storage.sync.set({logins: logins}, () => {})
}

/**
 * Get the hostname of the website
 * @returns {string}
 */
async function getHostName() {
    return new Promise(res => {
        chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
            let url = tabs[0].url
            let tmp = document.createElement("a")
            tmp.href = url
            let hostname = tmp.hostname
            tmp.remove()
            res(hostname)
        })
    })
}




let usernameInput
let websiteInput
let passwordInput
let indexInput

let hostname


window.onload = async () => {

    usernameInput = document.getElementById("username")
    websiteInput = document.getElementById("website")
    passwordInput = document.getElementById("password")
    indexInput = document.getElementById("index")
    
    usernameInput.addEventListener("input", update)
    websiteInput.addEventListener("input", update)
    passwordInput.addEventListener("input", update)
    indexInput.addEventListener("input", update)
    
    document.getElementById("copyPassword").addEventListener("click", () => copyPassword())
    document.getElementById("fillInField").addEventListener("click", () => fillInField())
    document.getElementById("save").addEventListener("click", () => save())


    let logins = await getStorageSync("logins")
    let username = await getStorageSync("username")
    hostname = await getHostName()
    let website = psl.parse(hostname).sld
    let index = ""
    
    for (let login of logins) {
        if ((login.domains.includes(hostname) || login.website == website) && username == login.username) {
            website = login.website
            index = login.index
            break
        }
    }
    
    websiteInput.value = website
    usernameInput.value = username
    indexInput.value = index
}

function test() {
    console.log(psl.parse("raw.githubusercontent.com"))
}



