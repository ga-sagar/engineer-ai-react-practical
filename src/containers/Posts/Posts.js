import React, { Component } from 'react';
import axios from 'axios';

import { Table } from 'react-bootstrap';
import PostDetailsModal from '../../components/PostDetailsModal/PostDetailsModal';

export default class Posts extends Component {
    apiUrl = process.env.REACT_APP_API_URL;

    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            currentPage: 0,
            totalPages: 0,
            selectedPost: null
        };
    }

    componentDidMount() {
        this.getPosts();
    }

    getPosts() {
        axios.get(`${this.apiUrl}&page=${this.state.currentPage}`)
            .then(response => {
                if (response && response.status && response.status === 200) {
                    const data = response.data;
                    const oldPosts = [...this.state.posts];
                    const totalPages = this.state.totalPages + 1;
                    const currentPage = totalPages;
                    this.setState({
                        posts: [...oldPosts, ...data.hits],
                        currentPage,
                        totalPages
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

    render() {
        const posts = this.state.posts;
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
                {this.state.selectedPost ? <PostDetailsModal selectedPost={this.state.selectedPost} onModalClose={this.onModalClose.bind(this)} /> : null}
            </React.Fragment>
        )
    }
}