import { useState } from "react";
import { useRouter } from "next/router";

export default function SearchForm () {
    const [data, setData] = useState('');
    const [genre, setGenre] = useState('');
    const router = useRouter()
    function search (e: any){
        e.preventDefault();
        router.push({
            pathname: '/searchResult',
            query: {keyword: data, genre: genre}
        })
    }
    return (
        <>
        <form method="get" id="form" onSubmit={search}>
        <div>キーワード検索</div>
        <input placeholder="キーワードを入力" value={data} onChange={(e) => setData(e.target.value)}/>
        <div>ジャンルで絞り込み</div>
        <input name="genre" id="1" type="radio" value={1} onChange={(e) => setGenre(e.target.value)} />
        <label htmlFor='1' >アイドル</label>
        <input name="genre" id="2" type="radio" value={2} onChange={(e) => setGenre(e.target.value)} />
        <label htmlFor="2">女性アーティスト</label>
        <input name="genre" id="3" type="radio" value={3} onChange={(e) => setGenre(e.target.value)} />
        <label htmlFor="3" >バンド</label>
        <input name="genre" id="4" type="radio" value={4} onChange={(e) => setGenre(e.target.value)} />
        <label htmlFor="4">男性アーティスト</label>
        <br />
        <button type="submit">検索</button>
        </form>
        </>
    )
}
