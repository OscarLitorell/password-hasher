

async function getStorageSync(key)  {
    return new Promise(res => chrome.storage.sync.get(key, data => res(data[key])))
}


function setUsername() {
    let username = document.getElementById("username").value

    chrome.storage.sync.set({username: username}, () => {})
}


async function downloadLogins() {
    let logins = await getStorageSync("logins")
    let text = JSON.stringify(logins)
    let blob = new Blob([text])

    let download = document.getElementById("logins")
    download.href = URL.createObjectURL(blob)
    download.download = "logins.json"
    download.click()
}



window.onload = () => {
    document.getElementById("set-username").addEventListener("click", setUsername)
    document.getElementById("download-logins").addEventListener("click", downloadLogins)
    getStorageSync("username").then(username => document.getElementById("username").value = username)
}