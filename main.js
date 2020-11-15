
class MSCell extends HTMLTableCellElement {

  
    constructor() {
        super();

        // イベント登録
        this.addEventListener('click', this.clickFunc);
        this.addEventListener('contextmenu', this.clickRightFunc);
        this.addEventListener('dblclick', this.clickDblFunc);
    }

    
    // マインスイーパ初期設定
 
    init(x, y, bombFlg) {

        // 開封フラグ（未開封のときfalse/開封済みのときtrue）
        this.openedFlg = false;
        // x座標
        this.x = x;
        // y座標
        this.y = y;
        // 爆弾フラグ（爆弾のときtrue/爆弾でなければfalse）
        this.bombFlg = bombFlg;
        // 見た目のクラス
        this.classList.add('closed')

    }

    
    // 周辺セルを設定
    // 周辺セルと、周辺セルの合計爆弾数を設定

    setArounds(arounds) {
        // 周辺セル
        this.arounds = arounds;
        // 周辺セルの爆弾数
        this.aroundBombCount = this.arounds.filter(around => around.bombFlg).length;
    }

    
    // そのセルの中身を表示する
    
    show() {
        if (this.bombFlg) {
            this.textContent = '💣';

            // 見た目の変更
            this.classList.remove('closed');
            this.classList.add('bombed');
        } else {
            // 爆弾ではないとき
            if (this.aroundBombCount > 0) {
                // 周辺の爆弾数が1個以上のときは数を表示
                this.textContent = this.aroundBombCount;
            }

            // 見た目の変更
            this.classList.remove('closed');
            this.classList.add('opened');
        }
    }

    
    // 左クリックしたとき
    
    clickFunc() {

        if (this.openedFlg) {
            // 開封済みのときは何もしない
            return;
        }

        if (this.textContent === '🚩' || this.textContent === '？') {
            // 「旗」や「？」がついてるときも何もしない
            return;
        }

        // 開封済みにする
        this.openedFlg = true;

        // このセルを開く
        this.show();

        if (this.bombFlg) {
            // このセルが爆弾のときはゲームオーバーなので全セルを開く
            msCells.forEach(button => button.show());
        } else {
            // このセルが爆弾でないとき
            if (this.aroundBombCount === 0) {
                // 周囲に爆弾が無いときは周囲のセルを全部開く
                this.arounds.forEach(around => around.clickFunc());
            }
        }
    }

    
    // 右クリックしたとき
    
    clickRightFunc(e) {

        // 右クリックメニュー禁止
        e.preventDefault();

        if (this.openedFlg) {
            // 既に開かれている場合は何もしない
            return;
        }

        if (this.textContent === '') {
            // 旗を表示
            this.textContent = '🚩';
        } else if (this.textContent === '🚩') {
            // ？を表示
            this.textContent = '？';
        } else if (this.textContent === '？') {
            // 元に戻す
            this.textContent = '';
        }

    }

    
    // セルをダブルクリックしたときの関数
    
    clickDblFunc() {
        if (!this.openedFlg) {
            // 既に開かれている場合は何もしない
            return;
        }

        // 周囲の旗の数を取得
        let flgCount = this.arounds.filter(around => around.textContent === '🚩').length;

        // 周囲の旗の数と、クリックしたセルに表示されている爆弾数が一致していれば
        // 周囲のセルをすべて開く
        if (this.aroundBombCount === flgCount) {
            this.arounds.forEach(around => around.clickFunc());
        }
    }

}


// カスタム要素の定義

customElements.define('ms-td', MSCell, { extends: 'td' });


// 全セルを格納しておく変数

let msCells = [];


// ゲーム初期化用関数

let initGame = function (xSize, ySize) {

    // ボタン配置
    for (let y = 0; y < ySize; y++) {
        let tr = document.createElement('tr');
        for (let x = 0; x < xSize; x++) {
            // セルを作る
            let msCell = document.createElement('td', { is: 'ms-td' });
            // セルの初期化
            msCell.init(x, y, Math.random() * 100 < 10);
            // セルをtrにいれておく
            tr.appendChild(msCell);
            // msCellsにも入れておく
            msCells.push(msCell);
        }
        document.getElementById('target').appendChild(tr);
    }

    // aroundsの設定
    msCells.forEach(msCell => {

        // 周囲8マスを取得
        let arounds = msCells.filter(otherCell => {

            if (msCell === otherCell) {
                return false;
            }

            let xArea = [msCell.x - 1, msCell.x, msCell.x + 1];
            let yArea = [msCell.y - 1, msCell.y, msCell.y + 1];

            if (xArea.indexOf(otherCell.x) >= 0) {
                if (yArea.indexOf(otherCell.y) >= 0) {
                    return true; the 
                }
            }
            return false;
        });

        // 周囲8マスをaroundsとして設定
        msCell.setArounds(arounds);
    });

}

initGame(50, 50);