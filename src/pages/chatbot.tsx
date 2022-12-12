import Head from "next/head";
import useSWR, { mutate } from 'swr';
import { SessionUser } from "./api/getUser";
import Header from "components/Header";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "styles/chatbot.module.css";
import { Item } from "types/item";
import Image from "next/image";
import Router from "next/router";
import React from "react";
import { config } from '../config/index';


const fetcher = (url: string) => fetch(url).then((res) => res.json());

type ChatList = { id: number, text: string, continue: boolean, option: string,}

const chatList: Array<ChatList> = [
    { id: 1, text: 'こんにちは、Nameさん！', continue: true, option: 'normal'},
    { id: 2, text: 'ようこそ「チャットボット」へ！', continue: true, option: 'normal'},
    { id: 3, text: '興味のあるジャンルを教えてください！',  continue: false, option: 'normal'},
    { id: 4, text: '選択してください。',  continue: true, option: 'choices'},
    { id: 5, text: 'answer',  continue: false, option: 'answer'},
    { id: 6, text: 'ふむふむ。わかりました！', continue: true, option: 'normal'},
    { id: 7, text: 'Nameさんにおすすめの作品はこちらです！', continue: true, option: 'normal'},
    { id: 8, text: '作品表示', continue: true, option: 'recommend'},
    { id: 9, text: 'さらにたくさんのおすすめ作品をトップページにご用意しました！', continue: true, option: 'normal'},
    { id: 10, text: 'トップページへ戻る', continue: false, option: 'return'}
]

export default function Chatbot({items}: {items: Array<Item>}) {
    const [count, setCount] = useState(1);
    const [output, setOutput] = useState([chatList[0]]);
    const [genre, setGenre] = useState(0)
    const [button, setButton] = useState(true);

    const { data } = useSWR<SessionUser>('/api/getUser', fetcher);

    const chatArea = useRef<HTMLDivElement>(null);

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

    useEffect(() =>{
        if(!button){
            if(count >= 5){
                return
            }
            const id = setTimeout(() => {
                setCount((prev) => prev + 1);
                setOutput((prev) => [...prev, chatList[count]])
            }, 300);
            return () => clearTimeout(id)
        }
        
    }, [button, count])

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

    useEffect(() => {
        chatArea?.current?.scrollIntoView(
            {
                behavior: "smooth" ,
                block: "end" ,
                inline: "nearest"
            }
        );
    })

    if (!data) return <div>Loading</div>

    const submit = async (e: any) => {
        e.preventDefault();
        setButton(false);
        const info = { favoriteGenre: genre }
        await fetch(`${config.users}/${data.userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(info)
        })
            .then((res) => res.json())
    }

    

    const route = () => {
        Router.push('/')
    }

    return (
        <>
            <Head>
                <title>
                    チャットボット
                </title>
            </Head>
            <Header isLoggedIn={data?.isLoggedIn} dologout={() => mutate('/api/getUser')} />
            <div className={styles.chatbotPage} key='chatbotPage'>
            <div className={styles.chatbotWrapper} key='chatbotWrapper'>
            <div id="chatbot-body" className={styles.chatbotBody} key='chatboy-body'>
                <div className={styles.header} key='header'>
                <h1 className={styles.title} key='chath1'>チャットボット</h1>
                </div>
                <div id="chatbot" className={styles.chatArea} key='chatArea'>
                    {output.map((obj) => {
                        if (obj.option === 'choices') {
                            return (
                                <div key='question'>
                                    {button ? (
                                        <div className={styles.choice} key='choice'>
                                        <div key={`cl${obj.id}`} className={styles.choiceTitle}>{obj.text}</div>
                                        <form method="get" id="form" onSubmit={submit} className={styles.form} key='form'>
                                        <div>
                                        <input name="favoriteGenre" key="1" type="radio" value={1} onChange={(e) => setGenre(Number(e.target.value))} />
                                        <label key="label1" htmlFor='1' >J-POP</label>
                                        </div>
                                        <div>
                                        <input name="favoriteGenre" key="2" type="radio" value={2} onChange={(e) => setGenre(Number(e.target.value))} />
                                        <label key="label2" htmlFor="2">アイドル</label>
                                        </div>
                                        <div>
                                        <input name="favoriteGenre" key="3" type="radio" value={3} onChange={(e) => setGenre(Number(e.target.value))} />
                                        <label key="label3" htmlFor="3" >邦楽ロック</label>
                                        </div>
                                        <div>
                                        <input name="favoriteGenre" key="4" type="radio" value={4} onChange={(e) => setGenre(Number(e.target.value))} />
                                        <label key="label4" htmlFor="4">洋楽ロック</label>
                                        </div>
                                        <div>
                                        <input name="favoriteGenre" key="5" type="radio" value={5} onChange={(e) => setGenre(Number(e.target.value))} />
                                        <label key="label5" htmlFor="5">アニソン</label>
                                        </div>
                                        <button className={styles.submitBtn} key={'button'} type="submit">決定</button>
                                        </form>
                                        </div>
                                            ) : (
                                                <div key={'none'}></div>
                                            )
                                        }
                                </div>
                            )
                        } else if(obj.option === 'answer'){
                            if(genre === 1){
                                return(
                                    <div key={`ans${obj.id}`} className={styles.answer}>
                                        <div key={`cl${obj.id}`} className={styles.rightChat}>{obj.text.replace('answer', `J-POP`)}</div>
                                    </div>
                                    
                                )
                            } else  if(genre === 2){
                                return(
                                    <div key={`ans${obj.id}`} className={styles.answer}>
                                        <div key={`cl${obj.id}`} className={styles.rightChat}>{obj.text.replace('answer', `アイドル`)}</div>
                                    </div>
                                )
                            } else  if(genre === 3){
                                return(
                                    <div key={`ans${obj.id}`} className={styles.answer}>
                                        <div key={`cl${obj.id}`} className={styles.rightChat}>{obj.text.replace('answer', `邦楽ロック`)}</div>
                                    </div>
                                )
                            } else  if(genre === 4){
                                return(
                                    <div key={`ans${obj.id}`} className={styles.answer}>
                                        <div key={`cl${obj.id}`} className={styles.rightChat}>{obj.text.replace('answer', `洋楽ロック`)}</div>
                                    </div>
                                )
                            } else  if(genre === 5){
                                return(
                                    <div key={`ans${obj.id}`} className={styles.answer}>
                                        <div key={`cl${obj.id}`} className={styles.rightChat}>{obj.text.replace('answer', `アニソン`)}</div>
                                    </div>
                                )
                            }
                        }else if(obj.option === 'return'){
                            return (
                                <div key='returnButton' className={styles.returnBtnWrapper} ref={chatArea}>
                                    <button className={styles.returnBtn} key={obj.id} onClick={route}>{obj.text}</button>
                                </div>
                            )
                        } else if(obj.option === 'recommend') {
                            return (
                                <section className={styles.itemList} ref={chatArea} key='recommend'>
                                {items.filter((item)=>{if(item.categories.includes(Number(genre))) return item})
                                .slice(0, 4)
                                .map((item)=>{
                                    return(
                                        <Link key={`itemLink${item.id}`} href={`/items/${item.id}`} className={styles.item}>
                                        <Image key={`itemImage${item.id}`} src={item.itemImage} width={400} height={225} alt={item.artist} className={styles.itemImage}/>
                                        <div key={`${item.artist}`} className={styles.artist}>{item.artist}</div>
                                        <div key={`${item.fesName}`} className={styles.fesName}>{item.fesName}</div>
                                        </Link>
                                    )
                                }).reverse()}
                                </section>
                            )
                        } else {
                            return (
                                <div key={`bot${obj.id}`} className={styles.bot} ref={chatArea}>
                                <Image key={`icon${obj.id}`} className={styles.icon} src={"/images/chatIcon.jpeg"} width={30} height={30} alt={"アイコン"} />
                                <div className={styles.botSays} key={`cl${obj.id}`}>{obj.text.replace('Name', `${data.userName}`)}</div>
                                </div>
                            )
                        }
                    })}
                </div>
            </div>
                <div key='closeChatbot' className={styles.closeChatbot} onClick={() => route()}>
                        ×
                </div>
            </div>
            </div>
        </>
    )
}

export async function getServerSideProps() {
    const res = await fetch(config.items)
    const items = await res.json()
    return {
        props: {
            items
        }
    }
}
