//大域変数
//映画一覧配列、映画の情報がオブジェクトで入っている
let watchedMoviesList = [];

document.getElementById("addWatchedMovieButton").addEventListener("click", function () {
    console.log("\n---\nボタンクリック確認");


    //エラーフラグ
    let isError = false;

    // 入力欄のエラーメッセージエリアをリセット
    document.getElementById("titleError").innerHTML = "";
    document.getElementById("dateError").innerHTML = "";
    document.getElementById("ratingError").innerHTML = "";
    document.getElementById("reviewError").innerHTML = "";


    /*映画タイトル入力*/
    //映画タイトルの内容を取得
    const movieTitleInput = document.getElementById("watchedMovieInput");
    const movieTitle = movieTitleInput.value.trim();//trimで前後の空白削除

    //未入力チェック
    if (!movieTitle) isError = showErrorMessage("titleError", "映画タイトルを入力してください。");

    //重複フラグ
    const exists = watchedMoviesList.some(item => item.title === movieTitle);//someメソッドで重複チェック
    //some(仮引数 => 条件式) 条件式を満たす要素が1つでもあればtrueを返す

    //重複チェック
    if (exists) isError = showErrorMessage("titleError", "同じ映画タイトルが既に登録されています。");


    /*鑑賞日入力*/
    const watchDateInput = document.getElementById("watchDateInput").value;
    if (!watchDateInput) isError = showErrorMessage("dateError", "鑑賞日を入力してください。");

    //日付データの-を/に変換
    const formattedDate = watchDateInput.replaceAll("-", "/");


    /*評価入力*/
    const ratingInput = document.getElementById("ratingInput").value;
    if (!ratingInput) {
        isError = showErrorMessage("ratingError", "評価を入力してください。");
    }

    /*レビュー入力*/
    const reviewInput = document.getElementById("reviewInput").value;
    if (!reviewInput) {
        isError = showErrorMessage("reviewError", "レビューを入力してください。");
    }



    //! エラーがある場合、処理を中断 !
    if (isError) return;



    //配列に映画の情報をオブジェクトとして追加
    const ID = crypto.randomUUID()

    watchedMoviesList.push({
        ID: ID,
        title: movieTitle,
        date: formattedDate,
        rating: ratingInput,
        review: reviewInput
    });

    console.log(watchedMoviesList);


    /*dom操作、表示*/
    showingWatchedMovies();



    /*ローカルストレージに保存*/
    localStorage.setItem("watchedMovies", JSON.stringify(watchedMoviesList));



    /*最後に入力欄をクリア*/
    movieTitleInput.value = "";
    document.getElementById("watchDateInput").value = "";
    document.getElementById("ratingInput").value = "";
    document.getElementById("reviewInput").value = "";
});




/*起動時点の動作*/
window.onload = function () {
    watchedMoviesList = JSON.parse(localStorage.getItem("watchedMovies")) || [];
    console.log(watchedMoviesList);

    showingWatchedMovies();


}




/*鑑賞済み映画リストを表示する関数*/
function showingWatchedMovies() {
    //ul要素を取得して中身をクリア
    const watchedMoviesListElement = document.getElementById("watchedMoviesList");
    watchedMoviesListElement.innerHTML = "";

    //配列の中身を1つずつ表示
    watchedMoviesList.forEach(movie => {

        //li要素とその中身を作成
        const litag = document.createElement("li");
        litag.className = "aWatchedMovie";
        litag.dataset.id = movie.ID; //削除用idを付与

        // タイトル作成
        const movieTitle = document.createElement("h3");
        movieTitle.textContent = movie.title;
        movieTitle.className = "inputNord";
        litag.appendChild(movieTitle);

        // 日付作成
        const watchDate = document.createElement("p");
        watchDate.textContent = `鑑賞日: ${movie.date}`;
        watchDate.className = "inputNord";
        litag.appendChild(watchDate);

        // 評価作成
        const movieRating = document.createElement("p");
        movieRating.textContent = `評価: ${movie.rating}`;
        movieRating.className = "inputNord";
        litag.appendChild(movieRating);

        // レビュー部分作成
        const review = document.createElement("p");
        review.textContent = `レビュー: \n${movie.review}`;
        review.className = "inputNord";
        review.classList.add("reviewParagraph");
        litag.appendChild(review);

        //削除ボタン作成
        const delBtn = document.createElement("button");
        delBtn.textContent = "削除";
        delBtn.className = "delBtn";
        litag.appendChild(delBtn);


        //ul要素にli要素を追加
        watchedMoviesListElement.appendChild(litag);

        /*
        <li class="watchedMovies">
            <h3 class="inputNord">チェンソーマン</h3>
            <p class="inputNord">鑑賞日: 2025/10/10</p>
            <p class="inputNord">評価: 5</p>
            <p class="inputNord">レビュー: レゼに誘惑されるデンジが可愛かった。バトルシーンが原作から大幅に拡張されていて見応え抜群！</p>
        </li>
        */
    });
}





/*エラーメッセージを表示する関数*/
function showErrorMessage(ID, message) {
    //現在のエラーメッセージ欄を取得
    const errorArea = document.getElementById(ID);

    //メッセージエリアをリセット
    errorArea.innerHTML = "";

    //タグを作って挿入
    const errorMessage = document.createElement("p");
    errorMessage.textContent = message;
    errorMessage.className = "errorMessage";
    errorArea.appendChild(errorMessage);

    //エラーが起こったことをコンソールに表示
    console.log(`! ID:${ID}で${message}`);

    //エラーフラグを立てておく
    const hasError = true;
    return hasError;
}





//要素全体から削除ボタンが押されたか監視
document.getElementById("watchedMoviesList").addEventListener('click', (event) => {
    //eventには'click'時の情報(要素、マウス動作、時刻)が詰め込まれている

    //targetは実際にclickされた要素、触った情報が入る
    //closetでその要素を実際に操作できる要素を指定する
    const btn = event.target.closest('.delBtn');
    if (!btn) return; // 削除ボタン以外は無視


    const card = btn.closest('.aWatchedMovie');
    const delID = card.dataset.id;

    //指定したIDだけを除いた配列に上書き
    watchedMoviesList = watchedMoviesList.filter(item => item.ID !== delID);

    console.log(watchedMoviesList);

    /*ローカルストレージに保存*/
    localStorage.setItem("watchedMovies", JSON.stringify(watchedMoviesList));

    card.remove(); // 親ごと削除

});

