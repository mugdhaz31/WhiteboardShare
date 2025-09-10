import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
            {/* Navbar */}
            <Navbar />

            {/* Hero Section */}
            <section className="flex-1 flex flex-col items-center justify-center text-center px-6">
                <h2 className="pt-20 text-4xl md:text-5xl font-extrabold text-black mb-4">
                    Collaborate in Real-Time
                </h2>
                <p className="text-lg text-gray-600 max-w-xl mb-8">
                    Share ideas, sketch diagrams, and brainstorm with your team instantly
                    on a powerful online whiteboard.
                </p>

                {/* Action buttons */}
                <div className="flex gap-4">
                    <Link
                        to="/create-room"
                        className="px-6 py-3 bg-black text-white rounded-lg font-semibold 
                                   shadow-md hover:bg-gray-900 transition active:scale-95"
                    >
                        Create Room
                    </Link>
                    <Link
                        to="/join-room"
                        className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold 
                                   shadow-md hover:bg-gray-800 transition active:scale-95"
                    >
                        Join Room
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="px-6 py-20 bg-gray-50 text-center">
                <h3 className="text-3xl font-bold mb-12">✨ Features</h3>
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {[
                        { title: "Real-Time Collaboration", desc: "Work together with your team instantly, no matter where they are." },
                        { title: "Easy Sharing", desc: "Share your board with a simple link and start collaborating right away." },
                        { title: "Cross-Device Access", desc: "Use it on desktop, tablet, or mobile seamlessly with full functionality." },
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.2 }}
                            viewport={{ once: true }}
                            className="p-6 rounded-xl shadow-md bg-white hover:shadow-xl 
                                       hover:-translate-y-2 transition transform"
                        >
                            <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                            <p className="text-gray-600">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="px-6 py-20 bg-gray-50 text-center">
                <h3 className="text-3xl font-bold mb-12">⚡ How It Works</h3>
                <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12">
                    {[
                        { step: "1", title: "Create or Join a Room", desc: "Start by creating your own room or joining an existing one." },
                        { step: "2", title: "Collaborate Live", desc: "Sketch, write, and brainstorm with your team in real time." },
                        { step: "3", title: "Share & Save", desc: "Share your whiteboard link or save your progress for later." },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: i * 0.2 }}
                            viewport={{ once: true }}
                            className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl hover:scale-105 
                                       transition transform"
                        >
                            <span className="text-5xl font-extrabold text-black">{item.step}</span>
                            <h4 className="text-xl font-semibold mt-4 mb-2">{item.title}</h4>
                            <p className="text-gray-600">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>


            {/* Preview Whiteboard */}
            <section className="px-6 py-16 flex justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="w-full max-w-3xl border-2 border-dashed border-gray-400 
               rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden"
                >
                    <img
                        src="/preview.gif"
                        alt="Whiteboard Preview"
                        className="w-full h-auto object-contain rounded-xl"
                    />
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="w-full py-6 text-center text-gray-600 text-sm border-t">
                © {new Date().getFullYear()} Whiteboard Share — Built for Collaboration
            </footer>
        </div>
    );
};

export default Home;
