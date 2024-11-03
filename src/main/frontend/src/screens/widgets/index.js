import React, {useEffect, useState} from "react";
import "./widgets.css";
import WidgetCard from "./widgetCard";

export default function Widgets({artistID}) {
    const [similar, setSimilar] = useState([]);
    const [featured, setFeatured] = useState([]);
    const [newRelease, setNewRelease] = useState([]);

    useEffect(() => {
        // apiClient를 사용하지 않도록 수정하거나 사용하지 않도록 변경합니다.
    }, []);

    return (
        <div className="widgets-body flex">
            <WidgetCard title="Similar Artists" similar={similar}/>
            <WidgetCard title="Made For You" featured={featured}/>
            <WidgetCard title="New Releases" newRelease={newRelease}/>
        </div>
    );
}
