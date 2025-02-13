const AuthImagePattern=({title,subtitle})=>{
    const tempArr=[1,2,3,4,5,6,7,8,9];

    return <div className="hidden lg:flex items-center justify-center p-12">
            <div className="max-w-md text-center">
                <div className="grid grid-cols-3 gap-3 mb-8">
                    {tempArr.map((_,i)=>{
                        return <div key={i} className={`aspect-square rounded-2xl bg-primary/10 ${i%2===0?"animate-pulse":""}`}/>
                    })}
                </div>
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                <p className="text-base-content/60">{subtitle}</p>
            </div>
    </div>
}

export default AuthImagePattern;