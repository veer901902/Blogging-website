import { Appbar } from "../components/Appbar";
import { PostDetail } from "../components/PostDetail";
import { Spinner } from "../components/Spinner";
import { usePost } from "../hooks";
import {useParams} from "react-router-dom";

export const Post = () => {
    const { id } = useParams();
    const {loading, post} = usePost({
        id: id || ""
    });

    if (loading || !post) {
        return <div>
            <Appbar />
        
            <div className="h-screen flex flex-col justify-center">
                
                <div className="flex justify-center">
                    <Spinner />
                </div>
            </div>
        </div>
    }
    return <div>
        <PostDetail post={post} />
    </div>
}