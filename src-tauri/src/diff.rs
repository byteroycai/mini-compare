use serde::Serialize;
use similar::{Algorithm, ChangeTag, TextDiff};

#[derive(Serialize)]
pub struct DiffResult {
    left: Vec<String>,
    right: Vec<String>,
}

#[tauri::command]
pub fn diff_texts(left: String, right: String) -> DiffResult {
    let diff = TextDiff::configure()
        .algorithm(Algorithm::Myers)
        .diff_lines(&left, &right);

    let mut marked_left = Vec::new();
    let mut marked_right = Vec::new();

    for group in diff.grouped_ops(0) {
        for op in group {
            let mut left_block = Vec::new();
            let mut right_block = Vec::new();

            for change in diff.iter_changes(&op) {
                match change.tag() {
                    ChangeTag::Delete => {
                        left_block.push(change.value().trim_end_matches('\n'));
                    }
                    ChangeTag::Insert => {
                        right_block.push(change.value().trim_end_matches('\n'));
                    }
                    ChangeTag::Equal => {
                        let line = html_escape(change.value().trim_end_matches('\n'));
                        marked_left.push(line.clone());
                        marked_right.push(line);
                    }
                }
            }

            // 行数对齐（逐行做 highlight）
            let max_len = left_block.len().max(right_block.len());
            for i in 0..max_len {
                let l = left_block.get(i).copied().unwrap_or("");
                let r = right_block.get(i).copied().unwrap_or("");
                let (hl, hr) = highlight_line_diff(l, r);
                marked_left.push(hl);
                marked_right.push(hr);
            }
        }
    }

    DiffResult {
        left: marked_left,
        right: marked_right,
    }
}


/// 对两个字符串进行字符级对比，返回左右侧 HTML 渲染字符串
fn highlight_line_diff(left: &str, right: &str) -> (String, String) {
    let diff = TextDiff::configure()
        .algorithm(Algorithm::Myers)
        .diff_chars(left, right);

    let mut left_html = String::new();
    let mut right_html = String::new();

    for change in diff.iter_all_changes() {
        match change.tag() {
            ChangeTag::Equal => {
                let text = html_escape(change.value());
                left_html.push_str(&text);
                right_html.push_str(&text);
            }
            ChangeTag::Delete => {
                left_html.push_str(&format!(
                    "<span style=\"background-color:red;\">{}</span>",
                    html_escape(change.value())
                ));
            }
            ChangeTag::Insert => {
                right_html.push_str(&format!(
                    "<span style=\"background-color:yellow;\">{}</span>",
                    html_escape(change.value())
                ));
            }
        }
    }

    (left_html, right_html)
}

/// 转义 HTML 特殊字符
fn html_escape(input: &str) -> String {
    input
        .replace('&', "&amp;")
        .replace('<', "&lt;")
        .replace('>', "&gt;")
}