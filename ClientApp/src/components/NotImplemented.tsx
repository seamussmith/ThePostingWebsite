export function NotImplemented({ path }: { path: string }) {
    return (
        <div>
            <h1>Page Not Implemented</h1>
            <p>This path is not implemented</p>
            <p className="text-danger">
                If you see this page in a release build or production environment, please report this to the developers.
            </p>
            <p className="text-muted text-small">as if this project will even be in a production environment...</p>
        </div>
    );
}
