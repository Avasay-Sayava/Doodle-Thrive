import { useFolder } from "@/src/hooks/api/files/useFolder";
import Placeholder from "../../common/Placeholder";
import { useEffect } from "react";

export default function ChooseFileView() {
    const { refresh } = useFolder();

    return (<Placeholder></Placeholder>);
}