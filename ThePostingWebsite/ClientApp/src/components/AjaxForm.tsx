import React, { useRef, useState } from "react";
import { Form, FormProps } from "reactstrap";

interface AjaxFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
    onSuccessResponse?: (response: Response) => void;
    onClientErrorResponse?: (response: Response) => void;
    onServerErrorResponse?: (response: Response) => void;
    onInformationResponse?: (response: Response) => void;
    onRedirectResponse?: (response: Response) => void;
    onSubmitStart?: () => void | Promise<void>;
    onSubmitEnd?: () => void | Promise<void>;
}

export function AjaxForm(props: AjaxFormProps) {
    var formRef = useRef<HTMLFormElement>(null);
    const [disabled, setDisabled] = useState(false);
    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setDisabled(true);
        let buildStr = Array.from(new FormData(formRef.current!).entries()).reduce(
            (a, b) => a + `${encodeURIComponent(b[0])}=${encodeURIComponent(b[1] as string)}&`,
            ""
        );

        let built = new URLSearchParams(buildStr);

        // Setup request object
        let request: Promise<Response>;
        // Any methods other than get send the query string through the body
        if (props.method != "GET" && props.method != null) {
            request = fetch(props.action as string, {
                method: props.method,
                body: built,
            });
        } else {
            request = fetch(props.action + "?" + buildStr);
        }
        // Await the response and onSubmitStart at the same time, so if request takes longer than onSubmitStart, it wont add time to the overall submition
        let [response] = await Promise.all([request, props.onSubmitStart?.()]);
        // Call the right function for the right response
        if (response.status <= 199) props.onInformationResponse?.(response);
        else if (response.status <= 299) props.onSuccessResponse?.(response);
        else if (response.status <= 399) props.onRedirectResponse?.(response);
        else if (response.status <= 499) props.onClientErrorResponse?.(response);
        else if (response.status <= 599) props.onServerErrorResponse?.(response);
        else throw new Error("what");
        await props.onSubmitEnd?.();
        setDisabled(false);
    }

    return (
        <form {...props} onSubmit={onSubmit} ref={formRef}>
            <fieldset disabled={disabled}>{props.children}</fieldset>
        </form>
    );
}
