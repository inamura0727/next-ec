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

type ChatList = { id: number, text?: string, choices?:Array<Choice>, answers?:Array<Choice>, continue: boolean, option: string,}
type Choice = {id: number, text: string}

const chatList: Array<ChatList> = [
    { id: 1, text: 'こんにちは、Nameさん！', continue: true, option: 'normal'},
    { id: 2, text: 'ようこそ「チャットボット」へ！', continue: true, option: 'normal'},
    { id: 3, text: '何をお探しですか？', continue: true, option: 'normal',},
    { id: 4, text: '選択してください。', choices: [{id: 1, text:'今のおすすめ作品'}, {id: 2, text: '自分に合った作品を探す'}], continue: false, option: 'select'},
    { id: 5, text: '今のおすすめ作品はこちらです！', continue: true, option: 'normal'},
    { id: 6, continue: true, option: 'recommend'},
    { id: 7, text: 'どちらの方法で探しますか？', continue: true, option: 'normal',},
    { id: 8, text: '選択してください。', choices: [{id: 1, text:'興味のあるジャンルから探す'}, {id: 2, text: '今の気分から探す'}], continue: false, option: 'select'},
    { id: 9, text: '興味のあるジャンルを教えてください！', continue: false, option: 'normal'},
    { id: 10, text: '選択してください。', choices: [{id: 1, text:'J-POP'}, {id: 2, text: 'アイドル'}, {id: 3, text: '邦楽ロック'}, {id: 4, text: '洋楽ロック'}, {id: 5, text: 'アニソン'}, {id: 6, text: '男性アーティスト'}, {id: 7, text: '女性アーティスト'}], continue: false, option: 'select'},
    { id: 12, text: 'ふむふむ。わかりました！', continue: true, option: 'normal'},
    { id: 13, text: 'Nameさんにおすすめの作品はこちらです！', continue: true, option: 'normal'},
    { id: 14, continue: true, option: 'recommend'},
    { id: 15, text: 'さらにたくさんのおすすめ作品をトップページにご用意しました！', continue: true, option: 'normal'},
    { id: 16, text: 'トップページへ戻る', continue: false, option: 'return'},
    { id: 17, text: '今の気分は？', continue: true, option: 'normal',},
    { id: 18, text: '選択してください。', choices: [{id: 1, text:'気分を上げたい'}, {id: 2, text: 'リラックスしたい'}, {id: 3, text: '感動したい'}], continue: false, option: 'select'},
    { id: 19, text: '誰と観たい？', continue: true, option: 'normal',},
    { id: 20, text: '選択してください。', choices: [{id: 1, text:'一人で'}, {id: 2, text: '友達と'}, {id: 3, text: '家族と'}, {id: 4, text: '恋人と'}], continue: false, option: 'select'},
    { id: 21, text: 'ふむふむ。わかりました！', continue: true, option: 'normal'},
    { id: 22, text: 'Nameさんにおすすめの作品はこちらです！', continue: true, option: 'normal'},
    { id: 23, continue: true, option: 'recommend'},
    { id: 16, text: 'トップページへ戻る', continue: false, option: 'return'}
]

export default function Chatbot({items}: {items: Array<Item>}) {
    const [count, setCount] = useState(1);
    const [output, setOutput] = useState([chatList[0]]);
    const [option, setOption] = useState(0);
    const [method, setMethod] = useState(0);
    const [genre, setGenre] = useState(0);
    const [feeling, setFeeling] = useState(0);
    const [who, setWho] = useState(0)
    const [optionButton, setOptionButton] = useState(true);
    const [selectMethodButton, setSelectMethodButton] = useState(true);
    const [button, setButton] = useState(true);
    const [selectFeelingButton, setSelectFeelingButton] = useState(true);
    const [selectWhoButton, setSelectWhoButton] = useState(true);

    const { data } = useSWR<SessionUser>('/api/getUser', fetcher);

    const chatArea = useRef<HTMLDivElement>(null);

    // 1回目の質問まで
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

    // 1回目の質問解答後、1回だけ回す
    useEffect(() =>{
            if(count >= 5){
                return
            }
            if(!optionButton){
                if(option === 1){
                    const id = setTimeout(() => {
                        setCount((prev) => prev + 1);
                        setOutput((prev) => [...prev, chatList[count]])
                    }, 1000);
                    return () => clearTimeout(id)
                }
                if(option === 2){
                    const id = setTimeout(() => {
                        setCount((prev) => prev + 3);
                        setOutput((prev) => [...prev, chatList[count + 2]])
                    }, 1000);
                    return () => clearTimeout(id)
                }
        }
    }, [optionButton, count, option])

    // 「今のおすすめ」ルートを1回だけ回す
    useEffect(() => {
        if(count >=6){
            return
        }
        if(option === 1){
            if(count >= 5){
                if(option === 1){
                    const id = setTimeout(() => {
                        setCount((prev) => prev + 1);
                        setOutput((prev) => [...prev, chatList[count]]);
                    }, 2000);
                    return () => clearTimeout(id)
                }
            }
        }
    }, [count, option]);

    // 「今のおすすめルート」終了
    useEffect(() => {
        if(count >=7){
            return
        }
        if(option === 1){
            if(count >= 6){
                if(option === 1){
                    const id = setTimeout(() => {
                        setCount((prev) => prev + 1);
                        setOutput((prev) => [...prev, chatList[chatList.length -1]]);
                    }, 2000);
                    return () => clearTimeout(id)
                }
            }
        }
    }, [count, option]);

    // 「自分に合った作品」ルート1回だけ回す（質問提示）
    useEffect(() => {
        if(count >=8){
            return
        }
        if(option === 2){
            if(count >= 7){
                    const id = setTimeout(() => {
                        setCount((prev) => prev + 1);
                        setOutput((prev) => [...prev, chatList[count]]);
                    }, 2000);
                    return () => clearTimeout(id)
            }
        }
    }, [count, option]);

    // 質問回答後、1回だけ回す
    useEffect(() =>{
            if(count >= 10){
                return
            }
            if(option === 2){
                if(!selectMethodButton){
                    if(method === 1){
                        const id = setTimeout(() => {
                            setCount((prev) => prev + 1);
                            setOutput((prev) => [...prev, chatList[count]])
                        }, 1000);
                        return () => clearTimeout(id)
                    }
                    if(method === 2){
                        const id = setTimeout(() => {
                            setCount((prev) => prev + 8);
                            setOutput((prev) => [...prev, chatList[count + 7]])
                        }, 1000);
                        return () => clearTimeout(id)
                    }
            }
            }
    }, [count, method, option, selectMethodButton])

    // 「興味のあるジャンルルート」終了
    useEffect(() => {
        if(option === 2){
        if(method === 1){
            if(count >= 15){
                return
            }
                if(!button){
                    const id = setTimeout(() => {
                        setCount((prev) => prev + 1);
                        setOutput((prev) => [...prev, chatList[count]])
                    }, 2000);
                    return () => clearTimeout(id)
                    } else {
                        return
                    }
        }
        }
    }, [button, count, method, option]);

    // 「今の気分」ルート1回回して1つめの質問
    useEffect(() => {
        if(count >= 17){
            return
        }
        if(option === 2){
            if(method === 2){
                if(count >= 16){
                    const id = setTimeout(() => {
                        setCount((prev) => prev + 1);
                        setOutput((prev) => [...prev, chatList[count]]);
                    }, 2000);
                    return () => clearTimeout(id)
            }
            }
        }
    }, [count, method, option]);

    // 「今の気分」ルート2回回して2つめの質問
    useEffect(() => {
        if(count >= 19){
            return
        }
        if(option === 2){
            if(method === 2){
                if(!selectFeelingButton){
                    const id = setTimeout(() => {
                        setCount((prev) => prev + 1);
                        setOutput((prev) => [...prev, chatList[count]]);
                    }, 2000);
                    return () => clearTimeout(id)
            }
            }
        }
    }, [count, method, option, selectFeelingButton]);

    useEffect(() => {
        if(count === chatList.length){
            return
        }
        if(option === 2){
            if(method === 2){
                if(!selectWhoButton){
                    const id = setTimeout(() => {
                        setCount((prev) => prev + 1);
                        setOutput((prev) => [...prev, chatList[count]]);
                    }, 2000);
                    return () => clearTimeout(id)
            }
            }
        }
    }, [count, method, option, selectWhoButton]);


    useEffect(() => {
        chatArea?.current?.scrollIntoView(
            {
                behavior: "smooth" ,
                block: "end" ,
                inline: "nearest"
            }
        );
    });

    console.log(count)
    console.log(output)

    if (!data) return <div>Loading</div>

    const select = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setOptionButton(false);
    }

    const selectMethod = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setSelectMethodButton(false);
    }

    const selectFeeling = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setSelectFeelingButton(false);
    }

    const selectWho = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setSelectWhoButton(false);
    }

    const submit = async (e: { preventDefault: () => void; }) => {
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
                <div className={styles.title} key='chath1'>チャットボット</div>
                </div>
                <div id="chatbot" className={styles.chatArea} key='chatArea'>
                    {output.map((obj) => {
                        if (obj.choices) {
                            if(obj.id === 4)
                            return (
                                <div key={`question${obj.id}`} ref={chatArea}>
                                    {optionButton ? (
                                        <div className={styles.choice} key={`choice${obj.id}`}>
                                        <div key={`cl${obj.id}`} className={styles.choiceTitle}>{obj.text}</div>
                                        <form method="get" id="form" onSubmit={select} className={styles.form} key='form'>
                                        {obj.choices.map((choice)=>{
                                        return (
                                        <div key={choice.id}>
                                        <input name="favoriteGenre" key={choice.id} type="radio" value={choice.id} onChange={(e) => setOption(Number(e.target.value))} />
                                        <label key={`label${choice.id}`} htmlFor={choice.id.toString()} >{choice.text}</label>
                                        </div>
                                        )
                                        })}
                                        <button className={styles.submitBtn} key={'button'} type="submit">決定</button>
                                        </form>
                                        </div>
                                            ) : (
                                                    <div key={`ans${obj.id}`} className={styles.answer}>
                                                        <div key={`cl${obj.id}`} className={styles.rightChat}>
                                                            {obj.choices[option - 1].text}
                                                        </div>
                                                    </div>
                                                )
                                        }
                                </div>
                            )
                            if(obj.id === 8)
                            return (
                                <div key={`question${obj.id}`} ref={chatArea}>
                                    {selectMethodButton ? (
                                        <div className={styles.choice} key={`choice${obj.id}`}>
                                        <div key={`cl${obj.id}`} className={styles.choiceTitle}>{obj.text}</div>
                                        <form method="get" id="form" onSubmit={selectMethod} className={styles.form} key='form'>
                                        {obj.choices.map((choice)=>{
                                        return (
                                        <div key={choice.id}>
                                        <input name="favoriteGenre" key={choice.id} type="radio" value={choice.id} onChange={(e) => setMethod(Number(e.target.value))} />
                                        <label key={`label${choice.id}`} htmlFor={choice.id.toString()} >{choice.text}</label>
                                        </div>
                                        )
                                        })}
                                        <button className={styles.submitBtn} key={'button'} type="submit">決定</button>
                                        </form>
                                        </div>
                                            ) : (
                                                    <div key={`ans${obj.id}`} className={styles.answer}>
                                                        <div key={`cl${obj.id}`} className={styles.rightChat}>
                                                            {obj.choices[method - 1].text}
                                                        </div>
                                                    </div>
                                                )
                                        }
                                </div>
                            )
                            if(obj.id === 10)
                            return (
                                <div key={`question${obj.id}`} ref={chatArea}>
                                    {button ? (
                                        <div className={styles.choice} key='choice'>
                                        <div key={`cl${obj.id}`} className={styles.choiceTitle}>{obj.text}</div>
                                        <form method="get" id="form" onSubmit={submit} className={styles.form} key='form'>
                                        {obj.choices.map((choice)=>{
                                        return (
                                        <div key={choice.id}>
                                        <input name="favoriteGenre" key={choice.id} type="radio" value={choice.id} onChange={(e) => setGenre(Number(e.target.value))} />
                                        <label key={`label${choice.id}`} htmlFor={choice.id.toString()} >{choice.text}</label>
                                        </div>
                                        )
                                    })}
                                        <button className={styles.submitBtn} key={'button'} type="submit">決定</button>
                                        </form>
                                        </div>
                                            ) : (
                                                <div key={`ans${obj.id}`} className={styles.answer}>
                                                    <div key={`cl${obj.id}`} className={styles.rightChat}>
                                                        {obj.choices[genre - 1].text}
                                                    </div>
                                                </div>
                                                )
                                        }
                                </div>
                            )
                            if(obj.id === 18)
                            return (
                                <div key={`question${obj.id}`} ref={chatArea}>
                                    {selectFeelingButton ? (
                                        <div className={styles.choice} key='choice'>
                                        <div key={`cl${obj.id}`} className={styles.choiceTitle}>{obj.text}</div>
                                        <form method="get" id="form" onSubmit={selectFeeling} className={styles.form} key='form'>
                                        {obj.choices.map((choice)=>{
                                        return (
                                        <div key={choice.id}>
                                        <input name="favoriteGenre" key={choice.id} type="radio" value={choice.id} onChange={(e) => setFeeling(Number(e.target.value))} />
                                        <label key={`label${choice.id}`} htmlFor={choice.id.toString()} >{choice.text}</label>
                                        </div>
                                        )
                                    })}
                                        <button className={styles.submitBtn} key={'button'} type="submit">決定</button>
                                        </form>
                                        </div>
                                            ) : (
                                                <div key={`ans${obj.id}`} className={styles.answer}>
                                                    <div key={`cl${obj.id}`} className={styles.rightChat}>
                                                        {obj.choices[feeling - 1].text}
                                                    </div>
                                                </div>
                                                )
                                        }
                                </div>
                            )
                            if(obj.id === 20)
                            return (
                                <div key='question' ref={chatArea}>
                                    {selectWhoButton ? (
                                        <div className={styles.choice} key='choice'>
                                        <div key={`cl${obj.id}`} className={styles.choiceTitle}>{obj.text}</div>
                                        <form method="get" id="form" onSubmit={selectWho} className={styles.form} key='form'>
                                        {obj.choices.map((choice)=>{
                                        return (
                                        <div key={choice.id}>
                                        <input name="favoriteGenre" key={choice.id} type="radio" value={choice.id} onChange={(e) => setWho(Number(e.target.value))} />
                                        <label key={`label${choice.id}`} htmlFor={choice.id.toString()} >{choice.text}</label>
                                        </div>
                                        )
                                    })}
                                        <button className={styles.submitBtn} key={'button'} type="submit">決定</button>
                                        </form>
                                        </div>
                                            ) : (
                                                <div key={`ans${obj.id}`} className={styles.answer}>
                                                    <div key={`cl${obj.id}`} className={styles.rightChat}>
                                                        {obj.choices[who - 1].text}
                                                    </div>
                                                </div>
                                                )
                                        }
                                </div>
                            )
                        } else if(obj.option === 'return'){
                            return (
                                <div key='returnButton' className={styles.returnBtnWrapper} ref={chatArea}>
                                    <button className={styles.returnBtn} key={obj.id} onClick={route}>{obj.text}</button>
                                </div>
                            )
                        } else if(obj.option === 'recommend') {
                            return (
                                <section className={styles.itemList} ref={chatArea} key='recommend'>
                                {items.filter((item)=>{if(item.categories.includes(Number(genre))) return item})
                                .reverse()
                                .slice(0, 4)
                                .map((item)=>{
                                    return(
                                        <Link key={`itemLink${item.id}`} href={`/items/${item.id}`} className={styles.item}>
                                        <Image key={`itemImage${item.id}`} src={item.itemImage} width={400} height={225} alt={item.artist} className={styles.itemImage}/>
                                        <div key={`${item.artist}`} className={styles.artist}>{item.artist}</div>
                                        <div key={`${item.fesName}`} className={styles.fesName}>{item.fesName}</div>
                                        </Link>
                                    )
                                })}
                                </section>
                            )
                        } else {
                            if (obj.text)
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
