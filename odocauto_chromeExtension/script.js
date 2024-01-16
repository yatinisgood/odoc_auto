const checkboxes = document.querySelectorAll("input[type='checkbox']");
let checkedCount = 0;
let checkedIndexes = []; // 用於存儲勾選的checkbox索引
function processUrls(urls, currentIndex = 0) {
    if (currentIndex >= urls.length) {
        // 所有URL都已處理，重新加載頁面
        alert('所有請求已完成，即將重新加載頁面');
        window.location.reload();
        return;
    }

    fetch(urls[currentIndex])
        .then(response => {
            console.log(`請求 ${currentIndex} 完成: ${urls[currentIndex]}`);
            processUrls(urls, currentIndex + 1); // 遞迴調用以處理下一個URL
        })
        .catch(error => {
            console.error(`請求 ${currentIndex} 錯誤: ${error}`);
            processUrls(urls, currentIndex + 1); // 即使出錯，也繼續下一個URL
        });
}



console.log("您好，您已經載入公文自動化確認外掛~")
checkboxes.forEach((checkbox, index) => {
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      checkedCount++;
      checkedIndexes.push(index); // 添加索引到數組
    } else {
      checkedCount--;
      checkedIndexes = checkedIndexes.filter(i => i !== index); // 從數組移除索引

    }
  });
});
// 將按鈕插入到特定元素的左側

const element =document.querySelector("[name='ctl00$PlaceHolderMain$EmsListBoardUserControl1$ctl05']")
const button = document.createElement("button");
button.textContent = "爽爽批公文❤️By Sherlock";
element.insertAdjacentElement("afterend", button);

button.addEventListener("click", () => {
  event.preventDefault();
  let taskids = []; // 創建一個空陣列
  let documentids = []; // 創建一個空陣列


   checkedIndexes = []; // 重置勾選索引列表

  checkboxes.forEach((checkbox, index) => {
    if (checkbox.checked) {
      checkedIndexes.push(index); // 僅添加當前已勾選的checkbox索引
    }
  });
  if (checkedIndexes.length === 0) {
    alert("請至少勾選一個選項！");
    return; // 如果沒有勾選，則中止執行
  }
  const rows = document.querySelectorAll('tr.gv_MainBoard_body');
  const filteredRows = Array.from(rows).filter(tr => {
  // 檢查是否恰好有三個子元素
  if (tr.children.length === 3) {
    // 確保所有子元素都是<td>，並且沒有<th>
    return Array.from(tr.children).every(child => child.tagName === 'TD');
  }
  return false;
  });
  // 從filteredRows中獲取對應元素
  let taskid_selectedElements = checkedIndexes.map(index => {
    // 根據您的描述，實際索引應該是勾選索引的兩倍
    let actualIndex = index;
    return filteredRows[actualIndex];
  });
  

  taskid_selectedElements.forEach(tr => {
    // 獲取第三個td元素
    let thirdTd = tr.children[2]; 

    // 獲取td中的超連結
    let link = thirdTd.querySelector('a');

    // 檢查超連結是否存在，並獲取href屬性
    if (link) {
      let idMatch = link.href.match(/ID=(\d+)/);

      if (idMatch && idMatch[1]) {
        taskids.push(idMatch[1])
        
      }
        // console.log(link.href);
    }
  });
  const filteredRows14 = Array.from(rows).filter(tr => tr.children.length === 14);
  // 從filteredRows中獲取對應元素
  let dicumentid_selectedElements = checkedIndexes.map(index => {
    // 根據您的描述，實際索引應該是勾選索引的兩倍
    let actualIndex = index ;
    return filteredRows14[actualIndex];
  });


  dicumentid_selectedElements.forEach(tr => {
    let lastTd = tr.children[13]; // 獲取最後一個td
    let img = lastTd.querySelector('img'); // 假設要獲取的元件是一個<img>標籤

    if (img) {
        let onclickValue = img.getAttribute('onclick'); // 直接從HTML標籤獲取onclick屬性的值

        let documentIdMatch = onclickValue.match(/"(\d+)"/); // 使用正則表達式來提取數字

        if (documentIdMatch && documentIdMatch[1]) {
            documentids.push(documentIdMatch[1])
        }
    }
  });

  let urls=[];
  for (let i = 0; i < documentids.length; i++) {
    let url = `https://emsodas.cht.com.tw/Portal/PopupPages/TaskPopup/ConfirmPopup.aspx?TaskID=${taskids[i]}&DocumentID=${documentids[i]}`;
    urls.push(url);
  }
  console.log(urls)
  processUrls(urls);

});