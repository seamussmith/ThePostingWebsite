import React, { useRef } from "react";
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
    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        // Find every input that isnt a submit button
        let inputs = Array.from(
            formRef.current!.querySelectorAll(
                "input:not([type=submit], [type=radio], [type=checkbox]), textarea"
            ) as NodeListOf<HTMLInputElement>
        );
        let checkInputs = Array.from(
            formRef.current!.querySelectorAll("input[type=radio], input[type=checkbox]") as NodeListOf<HTMLInputElement>
        );
        // Find the submit button that was clicked
        let submitButton = formRef.current!.querySelector("input[type=submit]:focus") as HTMLInputElement;

        // Reduce all the inputs to a key value query string
        let buildStr = inputs.reduce((a, b) => {
            if (b.name) {
                return a + `${b.name}=${encodeURIComponent(b.value)}&`;
            } else {
                return a;
            }
        }, "");
        buildStr = checkInputs.reduce((a, b) => {
            if (b.checked && b.name) {
                return a + `${b.name}=${encodeURIComponent(b.value ?? "on")}&`;
            } else {
                return a;
            }
        }, buildStr);
        // Add the submit buttons value
        if (submitButton.name) {
            // Value should default to submit, just like a normal form
            buildStr += `${submitButton.name}=${submitButton.value ?? "Submit"}`;
        }

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
    }

    return <form {...props} onSubmit={onSubmit} ref={formRef} />;
}
