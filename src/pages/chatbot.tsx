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
import loadStyles from 'styles/loading.module.css';
import Chatbot from "components/chatbot";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type ChatList = { id: number, text?: string, choices?:Array<Choice>, continue: boolean, option: string,}
type Choice = {id: number, text: string}

export default function ChatbotPage({chatList}: {chatList: Array<ChatList>}) {
    const { data } = useSWR<SessionUser>('/api/getUser', fetcher);
    if (!data) return (
        <div className={loadStyles.loadingArea}>
          <div className={loadStyles.bound}>
            <span>L</span>
            <span>o</span>
            <span>a</span>
            <span>d</span>
            <span>i</span>
            <span>g</span>
            <span>...</span>
          </div>
        </div>
      );
    return (
        <>
            <Head>
                <title>
                    チャットボット
                </title>
            </Head>
            <Header isLoggedIn={data?.isLoggedIn} dologout={() => mutate('/api/getUser')} />
            <Chatbot chatList={chatList} data={data} />
        </>
    )
}

export async function getServerSideProps() {
    const res = await fetch(config.chatList)
    const chatList = await res.json()
    return {
        props: {
            chatList
        }
    }
}
