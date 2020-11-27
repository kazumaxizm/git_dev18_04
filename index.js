var bg = document.getElementById('loader-bg'),
    loader = document.getElementById('loader');

/* ロード画面の非表示を解除 */
bg.classList.remove('is-hide');
loader.classList.remove('is-hide');

/* 読み込み完了 */
window.addEventListener('load', stopload);

/* 10秒経ったら強制的にロード画面を非表示にする */
setTimeout('stopload()', 10000);

/* ロード画面を非表示にする処理 */
function stopload() {
    bg.classList.add('fadeout-bg');
    loader.classList.add('fadeout-loader');
}

// vueのcomponentを使えば、HTMLの要素とかを再利用することができる
// htmlの引数からpropsに値が渡されて、それがtemplateの中に入る感じ
// 書き込みされた、名前・メッセージ・日付を表示するコンポーネント
Vue.component('board-list', {
    template: '<li class="board-list"><div class="board-list__upper">名前: {{name}}（{{date}}）</div>{{message}}</li>',
    props: ['name', 'message', 'date', 'id'],
})

// 書き込みする要素を整理したコンポーネント
Vue.component('board-form', {
    template: '<div class="form-area">名前 : <input v-model="name"> </br>コメント: \
    <textarea v-model="message"></textarea> </br><br><button v-on:click="doAdd">書き込む</button></div>',
    data: function () {
        return {
            message: '',
            name: ''
        }
    },
    methods: {
        doAdd: function () {
            this.$emit('input', this.name, this.message)
            this.message = ''
            this.name = ''
        }
    }
})

var board = new Vue({
    el: '#board',
    data: {
        lists: [
        ]
    },
    // 生成時に実行される関数
    created: function () {
        var vue = this;
        firebase.database().ref('board').on('value', function (snapshot) {
            vue.lists = snapshot.val();
        });
    },
    methods: {
        doAdd: function (name, message) {
            var now = new Date();
            firebase.database().ref('board').push({
                name: name,
                message: message,
                date: now.getMonth() + 1 + '月' + now.getDate() + '日' + now.getHours() + '時' + now.getMinutes() + '分'
            });
        }
    }
})


