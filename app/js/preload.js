const remote = require('electron').remote
const { ipcRenderer } = require('electron')
const Menu = remote.Menu

const remWindow = remote.getCurrentWindow()
var nsfwFiler = null
var website_title = null

document.addEventListener('DOMContentLoaded', (e) => {
    console.log('OB : READY')

    var style = document.createElement('style')
    style.textContent = ':root{--background-accent: #913737;--background-accent-light: #aa4646}#ob--nsfw{z-index:9998;position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(10px);transition:0.5s ease-out;display:flex}#ob--nsfw #ob--content{position:absolute;z-index:9999;top:40%;left:50%;transform:translateY(-50%) translateX(-50%)}#ob--nsfw #ob--content #ob--img{display:block;margin:0 auto;width:40px;height:40px}#ob--nsfw #ob--content #ob--p{font-family:Helvetica, Arial, sans-serif;color:#fff;margin:16px 0}#ob--nsfw #ob--content #ob--button{z-index:10000;color:#fff;width:100%}.ob--button{outline:none;color:var(--text-normal);background:var(--background-accent);transition:0.1s ease-in-out;-webkit-tap-highlight-color:transparent;align-items:center;border-radius:4px;box-sizing:border-box;cursor:pointer;display:inline-flex;flex-shrink:0;font-weight:500;height:32px;justify-content:center;min-width:5.14em;outline-width:0;padding:8px 16px;position:relative;user-select:none;text-decoration:none;--ink-color: white;--paper-ripple-opacity: 0.32;background-color:var(--background-accent);border:none}.ob--button:hover{background-color:var(--background-accent-light)}.ob--button.outline{background:transparent;border:1px solid rgba(0,0,0,0.1);color:var(--background-accent)}.ob--button.outline:hover{background:rgba(0,0,0,0.05)}'

    document.head.append(style)
})

window.addEventListener('contextmenu', (e) => {
    e.preventDefault()

    var selectedElement = e.path[0]
    var selectedElementParent = e.path[1]

    var isLink = selectedElement.localName === 'a'
    var isParentLink = selectedElementParent.localName === 'a'
    var linkSrc = (isLink ? selectedElement.href : null)
    var parentLinkSrc = (isParentLink ? selectedElementParent.href : null)

    var isImage = selectedElement.localName === 'img'
    var imageSrc = (isImage ? selectedElement.currentSrc : null)


    var menu = [
        { /* reload page */
            label: 'Reload',
            type: 'normal',
            accelerator: 'CmdOrCtrl+R',
            click: () => {
                location.reload()
            },
            visible: !isImage,
            enabled: !isImage,
            icon: 'app/images/icons/refresh.png'
        },
        { /* Copy Link */
            label: 'Open Link in New Tab',
            type: 'normal',
            click: () => {
                if (isLink) {
                    openInNewTab(linkSrc)
                }
                if (isParentLink) {
                    openInNewTab(parentLinkSrc)
                }
            },
            enabled: isLink || isParentLink,
            visible: isLink || isParentLink
        },
        {
            type: 'separator',
            visible: isLink || isParentLink
        },
        { /* Copy Link */
            label: 'Copy Link',
            type: 'normal',
            click: () => {
                if (isLink) {
                    copyTextToClipboard(linkSrc)
                }
                if (isParentLink) {
                    copyTextToClipboard(parentLinkSrc)
                }
            },
            enabled: isLink || isParentLink,
            visible: isLink || isParentLink
        },
        {
            type: 'separator',
            visible: isLink || isParentLink
        },
        { /* open image in new tab */
            label: 'Open Image in New Tab',
            type: 'normal',
            click: () => {
                openInNewTab(imageSrc)
            },
            enabled: isImage,
            visible: isImage
        },
        { /* save image as */
            label: 'Save Image As...',
            type: 'normal',
            click: () => {

            },
            enabled: false,
            visible: isImage
        },
        { /* copy image */
            label: 'Copy Image',
            type: 'normal',
            click: () => {

            },
            enabled: false,
            visible: isImage
        },
        { /* copy image link */
            label: 'Copy Image Link',
            type: 'normal',
            click: () => {
                copyTextToClipboard(imageSrc)
            },
            enabled: isImage,
            visible: isImage
        },
        {
            type: 'separator'
        },
        {
            label: 'Create QR Code',
            type: 'normal',
            accelerator: 'CommandOrControl+Q',
            icon: 'app/images/icons/qr_code.png'
        },
        {
            type: 'separator'
        },
        { /* open devtools */
            label: 'Inspect',
            type: 'normal',
            accelerator: 'CommandOrControl+Shift+I',
            click: (e) => {
                ipcRenderer.sendToHost('toggleDevTools')
            },
            icon: 'app/images/icons/code.png'
        }
    ]

    menu = menu.filter(item => item.visible !== false)

    Menu.buildFromTemplate(menu).popup(remWindow)
})

function openInNewTab(url) {
    window.open(url, '_blank').focus()
}

function copyTextToClipboard(text) {
    navigator.clipboard.writeText(text)
}

window.addEventListener('blur', () => {
    ipcRenderer.sendToHost('blur')
})

window.addEventListener('focus', () => {
    ipcRenderer.sendToHost('focus')
})

window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.code === 'KeyR') {
        location.reload()
    }

    if (e.ctrlKey && e.shiftKey && e.code === 'KeyI') {
        ipcRenderer.sendToHost('toggleDevTools')
    }
})

ipcRenderer.on('nsfw_warning', () => {
    showNSFW()
})

ipcRenderer.on('nsfw_warning', (e, data) => { console.log('yes') })

function showNSFW() {
    var inner_html = '<div id="content">'
    inner_html += '<img src="'
    inner_html += '<p>This page is rated as "nsfw"</p>'
    inner_html += '<button class="button">continue on this page</button>'
    inner_html += '</div>'

    website_title = document.title
    document.title = 'Great site'

    var div_content = document.createElement('div')
    div_content.id = 'ob--content'

    var btnc = document.createElement('button')
    btnc.classList.add('ob--button')
    btnc.id = 'ob--button'
    btnc.innerText = 'continue on this page'
    btnc.addEventListener('click', (e) => {
        hideNSFW()
    })

    var img = document.createElement('img')
    img.id = 'ob--img'
    img.src = 'data:image/svg+xml;base64,PHN2ZwogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIGhlaWdodD0iMjRweCIKICAgdmlld0JveD0iMCAwIDI0IDI0IgogICB3aWR0aD0iMjRweCIKICAgZmlsbD0iI2RkNTc1NyIKICAgdmVyc2lvbj0iMS4xIj4KICA8cGF0aAogICAgIGlkPSJjaXJjbGUyIgogICAgIGQ9Im0gMTQsMTkgYSAyLDIgMCAwIDEgLTIsMiAyLDIgMCAwIDEgLTIsLTIgMiwyIDAgMCAxIDIsLTIgMiwyIDAgMCAxIDIsMiB6IiAvPgogIDxwYXRoCiAgICAgZD0iTTEyIDNjLTEuMSAwLTIgLjktMiAydjhjMCAxLjEuOSAyIDIgMnMyLS45IDItMlY1YzAtMS4xLS45LTItMi0yeiIKICAgICBpZD0icGF0aDQiIC8+Cjwvc3ZnPgo='

    var p_text = document.createElement('p')
    p_text.id = 'ob--p'
    p_text.textContent = 'This page is rated as "nsfw"'

    div_content.appendChild(img)
    div_content.appendChild(p_text)
    div_content.appendChild(btnc)

    var nsfw_filter = document.createElement('div')
    nsfw_filter.id = 'ob--nsfw'
    nsfw_filter.appendChild(div_content)

    document.body.appendChild(nsfw_filter)

    nsfwFiler = nsfw_filter

    document.body.style.overflow = 'hidden'
}

function hideNSFW() {
    nsfwFiler.remove()
    nsfwFiler = null

    document.body.style.overflow = 'auto'
    document.title = website_title

    website_title = null
}