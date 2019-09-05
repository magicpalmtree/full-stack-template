import App, { Container } from 'next/app'
import Head from 'next/head'
import React from 'react'

export default class MyApp extends App {
    static async getInitialProps({ Component, ctx }) {
        let pageProps = {}

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx)
        }

        return { pageProps }
    }

    render() {
        const { Component, pageProps } = this.props

        return (
            <Container>
                <Head>
                    {/* SEO */}
                    <title>Template | TimKnowsBest</title>
                    <meta name="Description" content="A fast, feature-rich, and privacy preserving serverless web app template using the MERN stack with Ant Design, GraphQL, JSX in Markdown, and Next.js"></meta>
                </Head>
                <Component {...pageProps} />
            </Container>
        )
    }
}