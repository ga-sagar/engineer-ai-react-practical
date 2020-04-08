import React, { Component } from 'react';
import axios from 'axios';

import { Table } from 'react-bootstrap';
import PostDetailsModal from '../../components/PostDetailsModal/PostDetailsModal';
import Pagination from '../../components/Pagination/Pagination';

export default class Posts extends Component {
    apiUrl = process.env.REACT_APP_API_URL;
    intervalId;

    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            currentActivePage: 0,
            totalPages: 0,
            selectedPost: null,
            selectedPage: -1
        };
    }

    componentDidMount() {
        this.getPosts();
        this.intervalId = setInterval(() => {
            this.getPosts();
        }, 10000);
    }

    componentWillUnmount() {
        // clear interval to prevent unnecessary memory leakage
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    getPosts() {
        axios.get(`${this.apiUrl}&page=${this.state.currentActivePage}`)
            .then(response => {
                if (response && response.status && response.status === 200) {
                    const data = response.data;
                    const oldPosts = [...this.state.posts];
                    const totalPages = this.state.totalPages + 1;
                    let currentActivePage = totalPages;
                    const selectedPage = this.state.selectedPage;
                    if (selectedPage > -1) {
                        currentActivePage = selectedPage
                    }
                    this.setState({
                        posts: [...oldPosts, ...data.hits],
                        currentActivePage,
                        totalPages,
                        selectedPage
                    });
                }
            })
            .catch(error => {
                alert('Something went wrong, unable to fetch post. Please try again later.');
            });
    }

    onPostSelect(selectedPost) {
        this.setState({
            selectedPost
        });
    }

    onModalClose() {
        this.setState({
            selectedPost: null
        });
    }

    onPageChange(event) {
        const target = event.target;
        if (target && target.tagName.toLowerCase() === 'a') {
            const selectedPage = parseInt(target.text.trim());
            this.setState({
                selectedPage,
                currentActivePage: selectedPage
            });
        }
    }

    render() {
        const startIndex = this.state.selectedPage > -1 ? (this.state.selectedPage - 1) * 20 : (this.state.currentActivePage - 1) * 20;
        const endIndex = startIndex + 20;
        const posts = this.state.posts.slice(startIndex, endIndex);
        return (
            <React.Fragment>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Url</th>
                            <th>Created At</th>
                            <th>Author</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map((post, index) => {
                            return (
                                <tr key={index} onClick={() => this.onPostSelect(post)}>
                                    <td>{post.title}</td>
                                    <td><a target="_blank" href={post.url} onClick={e => e.stopPropagation()}>{post.url}</a></td>
                                    <td>{post.created_at}</td>
                                    <td>{post.author}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>

                {/* Pagination */}
                {this.state.currentActivePage ? (
                    <Pagination currentActivePage={this.state.currentActivePage} totalPages={this.state.totalPages} onPageChange={this.onPageChange.bind(this)} />
                ) : null}

                {/* Post Modal */}
                {this.state.selectedPost ? (
                    <PostDetailsModal selectedPost={this.state.selectedPost} onModalClose={this.onModalClose.bind(this)} />
                ) : null}
            </React.Fragment>
        )
    }
}