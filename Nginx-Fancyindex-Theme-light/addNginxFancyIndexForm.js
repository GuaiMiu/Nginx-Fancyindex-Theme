// addNginxFancyIndexForm.js
// Add a small form to filter through the output of Nginx FancyIndex page
// © 2017, Lilian Besson (Naereen) and contributors,
// open-sourced under the MIT License, https://lbesson.mit-license.org/
// hosted on GitHub, https://GitHub.com/Naereen/Nginx-Fancyindex-Theme
// 等待DOM完全加载之后执行代码
document.addEventListener("DOMContentLoaded", function () {
  // 获取表头行
  const headerRow = document.querySelector("thead tr");

  // 获取所有的 <th> 元素
  const headers = headerRow.querySelectorAll("th");

  // 更新每个 <th> 中 <a> 标签的文本内容，保留箭头不变
  headers[0].querySelector("a").firstChild.textContent = "文件名"; // File Name -> 文件名
  headers[1].querySelector("a").firstChild.textContent = "文件大小"; // File Size -> 文件大小
  headers[2].querySelector("a").firstChild.textContent = "日期"; // Date -> 日期

  // 获取所有 <tr> 行，包含在 <tbody> 中的
  const rows = document.querySelectorAll("tbody tr");

  // 遍历每一行，查找包含 "Parent directory/" 的链接
  rows.forEach(function (row) {
    const link = row.querySelector("td.link a");
    if (link && link.textContent === "Parent directory/") {
      link.textContent = "上级目录/";
    }
  });

  // 从 localStorage 获取 token 值
  const token = localStorage.getItem("token"); // 假设 token 保存在 localStorage 中，键名是 'token'

  // 如果 token 存在
  if (token) {
    // 获取所有的链接 (<a> 标签)
    const links = document.querySelectorAll("td.link a");

    // 遍历每个链接，添加 token 参数
    links.forEach(function (link) {
      // 获取当前链接的 href 属性
      let href = link.getAttribute("href");

      // 如果链接已经包含参数，则直接添加 token 参数
      if (href.indexOf("?") !== -1) {
        // 如果已有参数，直接拼接 &token=从localStorage取出的值
        link.setAttribute("href", href + "&token=" + token);
      } else {
        // 如果没有参数，直接添加 ?token=从localStorage取出的值
        link.setAttribute("href", href + "?token=" + token);
      }
    });
  } else {
    console.error("No token found in localStorage.");
  }
});

var form = document.createElement("form");
var input = document.createElement("input");

input.name = "filter";
input.id = "search";
input.placeholder = "输入文件名进行搜索...";

form.appendChild(input);

document.querySelector("h1").after(form);

var listItems = [].slice.call(document.querySelectorAll("#list tbody tr"));

input.addEventListener("keyup", function () {
  var i,
    // Word sequence _matching_ to input. All, except last, words must be _complete_.
    e =
      "(^|.*[^\\pL])" +
      this.value.trim().split(/\s+/).join("([^\\pL]|[^\\pL].*[^\\pL])") +
      ".*$",
    n = RegExp(e, "i");
  listItems.forEach(function (item) {
    item.removeAttribute("hidden");
  });
  listItems
    .filter(function (item) {
      i = item.querySelector("td").textContent.replace(/\s+/g, " ");
      return !n.test(i);
    })
    .forEach(function (item) {
      item.hidden = true;
    });
});
