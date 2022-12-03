import Head from "next/head";
import useSWR, { mutate } from 'swr';
import { SessionUser } from "./api/getUser";
import Header from "components/Header";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "styles/chatbot.module.css";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type ChatList = { id: number, text: string, continue: boolean, option: string,}

const chatList: Array<ChatList> = [
    { id: 1, text: 'こんにちは、Nameさん！', continue: true, option: 'normal'},
    { id: 2, text: 'ようこそ「Chatbot」へ！', continue: true, option: 'normal'},
    { id: 3, text: '興味のあるジャンルを教えてください！',  continue: false, option: 'normal'},
    { id: 4, text: '選択してください。',  continue: true, option: 'choices'},
    { id: 5, text: 'ふむふむ。わかりました！', continue: true, option: 'normal'},
    { id: 6, text: 'Nameさんにおすすめの作品をトップページにご用意しました！', continue: true, option: 'normal'},
    { id: 7, text: 'トップページへ戻る', continue: false, option: 'return'}
]

export default function Chatbot() {
    const [count, setCount] = useState(1);
    const [output, setOutput] = useState([chatList[0]]);

    const { data } = useSWR<SessionUser>('/api/getUser', fetcher);

    useEffect(() => {
        if(count >= 4){
            return
        }
        const id = setTimeout(() => {
            setCount((prev) => prev + 1);
            setOutput((prev) => [...prev, chatList[count]])
        }, 2000);
        return () => clearTimeout(id)
    }, [count]);

    useEffect(() => {
        if(count >= 5){
        if(count === chatList.length){
            return
        }
        const id = setTimeout(() => {
            setCount((prev) => prev + 1);
            setOutput((prev) => [...prev, chatList[count]])
        }, 2000);
        return () => clearTimeout(id)
        } else {
            return
        }
    }, [count]);

    console.log(`useEffect内: ${count}`);
    console.log(`output: ${output}`);

    if (!data) return <div>Loading</div>

    const submit = async (e: any) => {
        e.preventDefault();
        const id = setTimeout(() => {
            setCount((prev) => prev + 1);
            setOutput((prev) => [...prev, chatList[count]])
        }, 1000);
        
        const info = { favoriteGenre: Number(e.target.value) }
        await fetch(`http://localhost:3000/api/users/${data.userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(info)
        })
            .then((res) => res.json())
            .then((info) => {
                console.log('Success:', info);
            })
            .catch((error) => {
                console.error('Error:', error)
            })
        return () => clearTimeout(id)
    }

    return (
        <>
            <Head>
                <section>
                    チャットボット
                </section>
            </Head>
            <Header isLoggedIn={data?.isLoggedIn} dologout={() => mutate('/api/getUser')} />
            <div id="chatbot-body">
                <h1>チャットボット</h1>
                <div id="chatbot" className={styles.chatbotBody}>
                    {output.map((obj) => {
                        if (obj.option === 'choices') {
                            return (
                                <>
                                    <div key={`cl${obj.id}`} className={styles.right}>{obj.text}</div>
                                    <form method="get" id="form" onChange={(e) => submit(e)} className={styles.right}>
                                        <input name="favoriteGenre" key="1" type="radio" value={1} />
                                        <label key="label1" htmlFor='1' >アイドル</label>
                                        <input name="favoriteGenre" key="2" type="radio" value={2} />
                                        <label key="label2" htmlFor="2">女性アーティスト</label>
                                        <input name="favoriteGenre" key="3" type="radio" value={3} />
                                        <label key="label3" htmlFor="3" >バンド</label>
                                        <input name="favoriteGenre" key="4" type="radio" value={4} />
                                        <label key="label4" htmlFor="4">男性アーティスト</label>
                                    </form>
                                </>
                            )
                        } else if(obj.option === 'return'){
                            return (
                                <Link href={"/"}>{obj.text}</Link>
                            )
                        } else {
                            return (
                                <div key={`cl${obj.id}`} className={styles.left}>{obj.text.replace('Name', `${data.userName}`)}</div>
                            )
                        }
                    })}
                </div>
            </div>
        </>
    )
}
