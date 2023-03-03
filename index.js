let emp_data, page_size, cur_page, t_body, btn_amount, btn_box, select_box;
document.addEventListener("DOMContentLoaded", function(){
    console.log("hi")
    fetch('/src/data.json')
        .then((response) => response.json())
        .then((data) => {
            // 전역변수들 초기화하는 함수 만드는게 나을듯 - 개선사항
            emp_data = data;
            page_size = 5;
            cur_page = 0;
            btn_amount = Math.ceil(emp_data.length / page_size);
            select_box = document.getElementById("dropdown");
            t_body = document.getElementById("emp_table_body");
            btn_box = document.getElementById("pagination");
            initSelect();
            setButton();
        })
});

// 페이지 크기, 번호(실제 페이지 -1)를 받아 페이징 후 테이블에 뿌려주는 함수
function setTable(){
    t_body.textContent = "";
    let td_order = {"name" : 0, "title" : 1, "email" : 2, "role" : 3};
    let td_list;
    emp_data.slice(cur_page*page_size, (cur_page*page_size)+page_size).forEach(emp => {
        td_list = new Array(4);
        let row_node = document.createElement("tr");
        for(const prop in emp){
            let td_node = document.createElement("td");
            td_node.innerText = emp[prop];
            td_list[td_order[prop]] = td_node;
        }
        td_list.forEach(td_node => row_node.appendChild(td_node));
        t_body.appendChild(row_node);
    });

    
}

// 페이지 크기를 받아 버튼목록을 설정해주는 함수
function setButton(){
    btn_box.textContent = "";

    // 화살표 버튼은 초기화 안하는게 좋음 - 개선사항
    let left_btn = document.createElement("button");
    left_btn.innerText = "<<";
    left_btn.classList.add("arrow_btn");
    left_btn.addEventListener("click", buttonClicked);
    btn_box.appendChild(left_btn);

    for(let i = 1; i <= btn_amount; i++){
        let page_btn = document.createElement("button");
        page_btn.classList.add("page_btn");
        if(i==1) page_btn.style.color = "red";
        page_btn.innerText = i;
        page_btn.addEventListener("click", buttonClicked);
        btn_box.appendChild(page_btn);
    }

    let right_btn = document.createElement("button");
    right_btn.innerText = ">>";
    right_btn.classList.add("arrow_btn");
    right_btn.addEventListener("click", buttonClicked);
    btn_box.appendChild(right_btn);
    
    setTable(0);
}

// 버튼클릭 이벤트 함수
function buttonClicked($event){
    if(parseInt($event.target.innerText) == (cur_page+1) || 
    ($event.target.innerText == "<<" && cur_page == 0) || 
    ($event.target.innerText == ">>" && cur_page == page_size-1)) return;

    let page_btn_list = document.getElementsByClassName("page_btn");
    for(let i = 0; i < page_btn_list.length; i++){
        page_btn_list[i].style.color = "black";
    }

    if($event.target.innerText == "<<"){
        cur_page = 0;
    } else if($event.target.innerText == ">>"){
        cur_page = btn_amount-1;
    } else {
        cur_page = parseInt($event.target.innerText)-1;
    }
    page_btn_list[cur_page].style.color = "red";

    setTable();
}

function initSelect(){
    let select = document.createElement("select");
    select.addEventListener("change", setPageSize)
    let options = [{"value":5, "text":"5개씩"}, {"value":15, "text":"15개씩"}];
    for(let i = 0; i < 2; i++){
        let option = document.createElement("option");
        option.value = options[i].value;
        option.text = options[i].text;
        select.appendChild(option);
    }
    select_box.appendChild(select);
}

function setPageSize($event){
    page_size = $event.target.value;
    btn_amount = Math.ceil(emp_data.length / page_size);
    cur_page = 0;
    setButton();
}