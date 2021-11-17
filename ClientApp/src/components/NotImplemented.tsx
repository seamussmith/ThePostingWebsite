export function NotImplemented({ path }: { path: string }) {
    return (
        <div>
            <h1>Page Not Implemented</h1>
            <h5 className="text-danger">
                If you see this page in a release build or production environment, please report this to the developers.
            </h5>
            <p className="text-muted">
                <small>as if this project will even be in a production environment...</small>
            </p>
        </div>
    );
}
