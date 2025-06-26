import illustration from "@/assets/codee.png"
import FormComponent from "@/components/forms/FormComponent"
import Footer from "@/components/common/Footer"


function HomePage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-16 bg-gradient-to-b from-[#23272f] to-[#2c313a] main-fade-in">
            <div className="my-12 flex h-full min-w-full flex-col items-center justify-evenly sm:flex-row sm:pt-0">
                <div className="flex w-full justify-center sm:w-1/2 sm:pl-4 transition-all duration-1000 hover:scale-105 glow-float">
                    <img
                        src={illustration}
                        alt="Code Sync Illustration"
                        className="mx-auto w-[250px] sm:w-[400px] drop-shadow-xl glow-float"
                    />
                </div>
                <div className="flex w-full items-center justify-center sm:w-1/2 animate-fadeIn">
                    <div className="card w-full max-w-[500px] shadow-2xl">
                        <FormComponent />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default HomePage
