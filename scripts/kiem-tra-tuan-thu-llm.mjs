#!/usr/bin/env node
/**
 * Script: kiem-tra-tuan-thu-llm.mjs
 * Mục tiêu: Đọc các tệp quy chuẩn (LLM/campaign) và schema để nhắc người dùng nếu lệch
 * Chỉ đọc file, không sửa đổi, không gọi mạng, không chạy Prisma.
 */

import fs from 'node:fs/promises'
import path from 'node:path'

const ROOT = process.cwd()

const FILES = [
    // Quy chuẩn & chế độ AI
    '.github/copilot-instructions.md',
    '.github/chatmodes/Melody AI.chatmode.md',
    'LLM.txt',

    // Nhật ký tiến trình & tài liệu tổng hợp
    'docs/quatrinh.md',
    'tailieu.doc',

    // Schema & đối chiếu thực thi
    'prisma/schema.prisma',
    'lib/nhat-ky-studio.js',

    // Tổng hợp policy Melody AI (nếu có)
    'docs/MELODY_AI_POLICY_SUMMARY.md'
]

function ok(label) {
    return `✅ ${label}`
}
function warn(label) {
    return `⚠️ ${label}`
}

async function readFileSafe(p) {
    try {
        const abs = path.join(ROOT, p)
        const buf = await fs.readFile(abs, 'utf8')
        return { ok: true, content: buf }
    } catch (e) {
        return { ok: false, error: e }
    }
}

async function run() {
    console.log('--- KIỂM TRA TUÂN THỦ LLM/MELODY AI ---')

    const results = await Promise.all(
        FILES.map(async (f) => ({ f, res: await readFileSafe(f) }))
    )

    let pass = 0
    let warnCount = 0

    // Báo cáo sự tồn tại các tệp
    for (const { f, res } of results) {
        if (res.ok) {
            console.log(ok(`Tìm thấy: ${f}`))
            pass++
        } else {
            console.log(warn(`Không tìm thấy: ${f}`))
            warnCount++
        }
    }

    // Kiểm tra các quy ước cốt lõi trong schema
    const schema = results.find((x) => x.f === 'prisma/schema.prisma')?.res
    if (schema?.ok) {
        const s = schema.content
        const checks = [
            { name: 'Bảng nhatKy tồn tại', regex: /model\s+nhatKy\s+\{/ },
            { name: 'User.roles mặc định []', regex: /roles\s+UserRole\[\]\s+@default\(\[\]\)/ },
            { name: 'Enum UserRole có ARTIST', regex: /enum\s+UserRole[\s\S]*?ARTIST/ }
        ]
        for (const c of checks) {
            if (c.regex.test(s)) {
                console.log(ok(c.name))
                pass++
            } else {
                console.log(warn(`Thiếu/khác: ${c.name}`))
                warnCount++
            }
        }
    } else {
        console.log(warn('Bỏ qua kiểm tra schema vì không đọc được prisma/schema.prisma'))
        warnCount++
    }

    // Kiểm tra guideline chính
    const llm = results.find((x) => x.f === '.github/copilot-instructions.md')?.res
    if (llm?.ok) {
        const t = llm.content
        if (t.includes('CÁC QUY TẮC DÀNH CHO AI')) {
            console.log(ok('Đã tìm thấy mục CÁC QUY TẮC DÀNH CHO AI'))
            pass++
        } else {
            console.log(warn('Thiếu mục CÁC QUY TẮC DÀNH CHO AI'))
            warnCount++
        }
    }

    const chatmode = results.find((x) => x.f === '.github/chatmodes/Melody AI.chatmode.md')?.res
    if (chatmode?.ok) {
        const t = chatmode.content
        if (t.includes('Chế độ này hướng dẫn AI trả lời thân thiện')) {
            console.log(ok('Chatmode Melody AI hợp lệ (phong cách trả lời)'))
            pass++
        } else {
            console.log(warn('Chatmode Melody AI thiếu mô tả phong cách'))
            warnCount++
        }
    }

    // Kiểm tra LLM.txt (nếu có)
    const llmTxt = results.find((x) => x.f === 'LLM.txt')?.res
    if (llmTxt?.ok) {
        const t = llmTxt.content
        if (/CÁC QUY TẮC DÀNH CHO AI|LLM|Nguồn xác định/i.test(t)) {
            console.log(ok('LLM.txt tồn tại và chứa hướng dẫn'))
            pass++
        } else {
            console.log(warn('LLM.txt thiếu nội dung hướng dẫn rõ ràng'))
            warnCount++
        }
    }

    // Đối chiếu thực thi: lib/nhat-ky-studio.js dùng bảng nào?
    const nkLib = results.find((x) => x.f === 'lib/nhat-ky-studio.js')?.res
    if (nkLib?.ok) {
        const t = nkLib.content
        const usesSnakeTable = /\bnhat_ky_studio\b/.test(t)
        const schemaHasModel = schema?.ok ? /model\s+nhatKy\s+\{/.test(schema.content) : false
        if (usesSnakeTable && schemaHasModel) {
            console.log(warn('Phát hiện lib/nhat-ky-studio.js dùng bảng nhat_ky_studio nhưng schema chỉ có model nhatKy. Cần đồng bộ (dùng @@map/@map hoặc đổi sang Prisma).'))
            warnCount++
        } else if (usesSnakeTable) {
            console.log(warn('lib/nhat-ky-studio.js dùng bảng nhat_ky_studio — chưa thấy model Prisma tương ứng.'))
            warnCount++
        } else {
            console.log(ok('lib/nhat-ky-studio.js không dùng bảng lạ ngoài schema nhatKy'))
            pass++
        }
    }

    console.log(`\nTổng kết: ${pass} mục đạt, ${warnCount} cảnh báo.`)
    console.log('Hoàn tất kiểm tra. Hãy cập nhật docs/quatrinh.md khi có thay đổi quan trọng.')
}

run().catch((e) => {
    console.error('LỖI:', e)
    process.exitCode = 1
})
