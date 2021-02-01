class chromeLikeTabs {

  /**
   * Constructor
   * @param {ConstructorOBJ} obj 
   */
  constructor(obj) {
    this['tabContainer'] = obj.tabContainer
    this['tabContentContainer'] = obj.tabContentContainer

    this['varName'] = obj.varName
    this['tabOnClick'] = obj.tabClickEvent
    this['tabAddClick'] = obj.tabAddClickEvent
    this['tabFocusChanged'] = obj.tabFocusChanged

    this['counter'] = 0
    this['tabs'] = {}
    this['inited'] = false

    this['focusedTab'] = null
    this['focusedTabContainer'] = null
  }

  /**
   * Initialize Tab Container
   */
  init() {
    this['tabContainer'].innerHTML = `<ul id="tabs"><button id="buttonAddNewTab" class="btn btn-default" onclick="${this['varName']}.addTab({ title: 'New Tab', favicon: null })"><i class="symbol icon-add"></i></button></ul>`
    this['tabList'] = document.getElementById('tabs')

    this['inited'] = true
  }

  /**
   * Add's a new Tab
   * @param {TabObject} tabObject 
   */
  addTab(tabObject) {
    if (this['inited']) {
      var title = tabObject.title
      var favicon = tabObject.favicon || 'app/images/favicon_404.svg'
      var id = this['counter']

      var tab_obj = {
        title: title,
        favicon: favicon,
        tabId: id
      }

      //#region TabItem
      var LI = document.createElement('li')   // 1
      var div = document.createElement('div') // 2
      var img = document.createElement('img') // 3
      var a = document.createElement('a')     // 4

      var button = document.createElement('button') // 5
      var i_tag = document.createElement('i')       // 5.1

      LI.setAttribute('tabID', id)
      LI.id = `tab-${id}`
      LI.addEventListener('click', (e) => {
        this['tabOnClick'](tab_obj)
        this.focuseTab(id)
      })

      div.classList.add('top')
      img.src = favicon
      a.innerText = title

      button.classList.add('btnCloseTab')
      button.setAttribute('onclick', `${this['varName']}.closeTab(${id})`)
      i_tag.classList.add('symbol')
      i_tag.classList.add('icon-close')

      button.appendChild(i_tag)
      LI.appendChild(div)
      LI.appendChild(img)
      LI.appendChild(a)
      LI.appendChild(button)
      //#endregion

      //#region TabContent
      var div_0 = document.createElement('div')
      var div_ctrls = document.createElement('div')
      var div_inputb = document.createElement('div')
      var webv = document.createElement('webview')

      div_0.classList.add('tab-pane')
      div_0.id = `container-${id}`

      div_ctrls.innerHTML += `<button onclick="" ><i class="icon icon-arrow_back"></i></button>`
      div_ctrls.innerHTML += `<button onclick="" ><i class="icon icon-arrow_forward"></i></button>`
      div_ctrls.innerHTML += `<button onclick="" ><i class="icon icon-refresh"></i></button>`

      div_inputb.classList.add('inputURL')
      div_inputb.innerHTML = `<input type="text" placeholder="URL">`

      div_ctrls.appendChild(div_inputb)
      div_ctrls.classList.add('controls')
      div_ctrls.innerHTML += `<button onclick=""><i class="icon icon-more_vert"></i></button>`

      webv.id = `webview-${id}`
      webv.setAttribute('src', 'https://duckduckgo.com/chrome_newtab')

      div_0.appendChild(div_ctrls)
      div_0.appendChild(webv)
      //#endregion

      this['tabList'].insertBefore(LI, document.getElementById('buttonAddNewTab'))
      this['tabContentContainer'].appendChild(div_0)
      this['tabs'][id] = tab_obj
      this['counter']++

      this.focuseTab(id)
    }
  }

  /**
   * Closes a Tab
   * @param {int} id 
   */
  closeTab(id) {
    document.getElementById(`tab-${id}`).remove()
    document.getElementById(`container-${id}`).remove()
    delete this['tabs'][id]

    this['tabAddClick'](id)
  }

  focuseTab(id) {
    var tab = document.getElementById(`tab-${id}`)
    var tabContent = document.getElementById(`container-${id}`)
    console.log(tabContent)

    if (this['focusedTab'] != null) {
      this['focusedTab'].classList.remove('active')
      tab.classList.add('active')
    } else {
      tab.classList.add('active')
    }
    this['focusedTab'] = tab

    if (this['focusedTabContainer'] != null) {
      this['focusedTabContainer'].classList.remove('active')
      tabContent.classList.add('active')
    } else {
      tabContent.classList.add('active')
    }
    this['focusedTabContainer'] = tabContent

    this['tabFocusChanged'](this['tabs'][id])
  }

  webviewLoadURL(url, id) {
    var webv = document.getElementById(`webview-${id}`)
    webv.src = url
  }
}

module.exports.chromeLikeTabs = chromeLikeTabs