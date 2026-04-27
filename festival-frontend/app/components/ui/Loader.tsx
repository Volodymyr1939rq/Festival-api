interface loadingWrapperInterface{
    isLoading:boolean;
    children:React.ReactNode;
}

export default function Loader({isLoading,children}:loadingWrapperInterface){
    if(isLoading){
        return (
            <div className="flex items-center justify-center min-h-100 w-full">
                <div className="w-16 h-16 border-4 border-t-pink-600 border-r-purple-500 border-b-blue-500 border-l-transparent rounded-full animate-spin"></div>
            </div>
        )
    }
    return <div className="animate-in fade-in duration-500">{children}</div>
}
