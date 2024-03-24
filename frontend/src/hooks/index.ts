import { useEffect, useState } from "react"
import axios from "axios";
import { BACKEND_URL } from "../config";


export interface Post {
    "content": string;
    "title": string;
    "id": number
    "author": {
        "name": string
    }
}

export const usePost = ({ id }: { id: string }) => {
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState<Post>();

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/post/${id}`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                setPost(response.data);
                setLoading(false);
            })
    }, [id])

    return {
        loading,
        post
    }

}
export const usePosts = () => {
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/post/bulk`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
            .then(response => {
                console.log(response.data);
                setPosts(response.data);
                setLoading(false);
            })
    }, [])

    return {
        loading,
        posts
    }
}