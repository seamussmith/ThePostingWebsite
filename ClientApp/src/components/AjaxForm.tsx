import React, { useRef } from "react";
import { Form, FormProps } from "reactstrap";

interface AjaxFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
    onSuccessResponse?: (response: Response) => void;
    onErrorResponse?: (response: Response) => void;
    onSubmitStart?: () => void | Promise<void>;
    onSubmitEnd?: () => void | Promise<void>;
}

export function AjaxForm(props: AjaxFormProps) {
    var formRef = useRef<HTMLFormElement>(null);
    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        await props.onSubmitStart?.();
        let inputs = formRef.current!.querySelectorAll("input:not([type=submit])") as NodeListOf<HTMLInputElement>;
        let submitButton = formRef.current!.querySelector("input[type=submit]:focus") as HTMLInputElement;
        let buildStr = "";
        inputs.forEach((x) => (buildStr += encodeURIComponent(x.value) + "&"));
        buildStr += submitButton.value;
        let built = new URLSearchParams(buildStr);
        let response: Response;
        if (props.method != "GET")
            response = await fetch(props.action as string, {
                method: props.method,
                body: built,
            });
        else response = await fetch(props.action + "?" + buildStr);
        if (response.status >= 299) props.onErrorResponse?.(response);
        else props.onSuccessResponse?.(response);
        await props.onSubmitEnd?.();
    }

    return <form {...props} onSubmit={onSubmit} ref={formRef} />;
}
