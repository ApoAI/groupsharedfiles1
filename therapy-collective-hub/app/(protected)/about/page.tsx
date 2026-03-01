'use client';

import { motion } from 'framer-motion';
import { Leaf, Shield, Heart, Users, BookOpen, MessageCircle, Lock, Globe } from 'lucide-react';

const features = [
    {
        icon: BookOpen,
        title: 'Shared Resource Library',
        description: 'Browse and search a curated collection of therapeutic tools, worksheets, articles, and more — all contributed by fellow clinicians.',
    },
    {
        icon: MessageCircle,
        title: 'Collaborative Discussion',
        description: 'Leave comments and reactions on resources to share insights, tips, and clinical considerations with the collective.',
    },
    {
        icon: Shield,
        title: 'Privacy-First',
        description: 'Password-protected access ensures only collective members can view and contribute. No client data is ever stored.',
    },
    {
        icon: Heart,
        title: 'Reactions & Favorites',
        description: 'React to resources you find valuable so the best ones rise to the top. Show appreciation for your colleagues\' contributions.',
    },
];

const guidelines = [
    'Never post client-identifying information or protected health data.',
    'Only share resources you have the rights to distribute.',
    'Be respectful and constructive in discussions.',
    'Tag and categorize resources accurately to help others find them.',
    'Report any concerns or issues to the collective administrator.',
];

export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-12">
            {/* Hero */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <div className="w-20 h-20 bg-[#F0EFEA] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Leaf className="w-10 h-10 text-[#8F9F8A]" />
                </div>
                <h1 className="text-4xl font-serif text-[#4A4A4A] mb-4">
                    Therapy Collective Hub
                </h1>
                <p className="text-lg text-[#6B6B6B] max-w-2xl mx-auto leading-relaxed">
                    A peaceful digital sanctuary where our collective of counsellors can share, discover, and discuss professional resources — all in one private, secure space.
                </p>
            </motion.div>

            {/* Features */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <h2 className="text-2xl font-serif text-[#4A4A4A] mb-6 text-center">What You Can Do</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {features.map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 + i * 0.1 }}
                            className="bg-white rounded-3xl p-6 border border-[#E8E6E1] shadow-sm"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-[#F0EFEA] rounded-2xl text-[#8F9F8A] flex-shrink-0">
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-[#4A4A4A] mb-1">{feature.title}</h3>
                                    <p className="text-sm text-[#6B6B6B] leading-relaxed">{feature.description}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* How It Works */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-3xl p-8 border border-[#E8E6E1] shadow-sm"
            >
                <h2 className="text-2xl font-serif text-[#4A4A4A] mb-6 text-center">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-[#8F9F8A] rounded-2xl flex items-center justify-center mx-auto mb-4 text-white font-serif text-xl">
                            1
                        </div>
                        <h3 className="font-medium text-[#4A4A4A] mb-2">Browse & Search</h3>
                        <p className="text-sm text-[#6B6B6B]">
                            Explore the library by category, format, or keyword. Find exactly what you need for your practice.
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-[#8F9F8A] rounded-2xl flex items-center justify-center mx-auto mb-4 text-white font-serif text-xl">
                            2
                        </div>
                        <h3 className="font-medium text-[#4A4A4A] mb-2">Contribute</h3>
                        <p className="text-sm text-[#6B6B6B]">
                            Share resources via link or file upload. Add descriptions, tags, and private notes for context.
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-[#8F9F8A] rounded-2xl flex items-center justify-center mx-auto mb-4 text-white font-serif text-xl">
                            3
                        </div>
                        <h3 className="font-medium text-[#4A4A4A] mb-2">Discuss</h3>
                        <p className="text-sm text-[#6B6B6B]">
                            Leave comments and reactions to help fellow clinicians find the most impactful resources.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Community Guidelines */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-[#F0EFEA]/50 rounded-3xl p-8 border border-[#E8E6E1]"
            >
                <div className="flex items-center gap-3 mb-6">
                    <Lock className="w-5 h-5 text-[#8F9F8A]" />
                    <h2 className="text-2xl font-serif text-[#4A4A4A]">Community Guidelines</h2>
                </div>
                <ul className="space-y-3">
                    {guidelines.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <div className="w-5 h-5 bg-[#8F9F8A] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-xs font-bold">{i + 1}</span>
                            </div>
                            <span className="text-[#6B6B6B] text-sm leading-relaxed">{item}</span>
                        </li>
                    ))}
                </ul>
            </motion.div>

            {/* Footer Note */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center py-8 text-sm text-[#8C8C8C]"
            >
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Globe className="w-4 h-4" />
                    <span>Built with care for our counselling community</span>
                </div>
                <p>Questions or issues? Contact your collective administrator.</p>
            </motion.div>
        </div>
    );
}
