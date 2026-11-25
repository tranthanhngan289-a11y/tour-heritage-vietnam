# HƯỚNG DẪN TỪ A-Z: XÂY DỰNG AI CHATBOT TƯ VẤN DU LỊCH TRÊN DIFY.AI
*Dành cho Doanh nghiệp Heritage Tours Việt Nam*

---

## 📦 BỘ TỆP DỮ LIỆU ĐÃ ĐƯỢC CHUẨN HÓA SẴN CHO DIFY:

Trong thư mục dự án của bạn, tôi đã chuẩn bị sẵn **3 tệp chuẩn hóa cao cấp**:
1. **[dify_knowledge_base.md](file:///Users/tranngan/Desktop/Tour%20%C4%90A%CC%80%20Na%CC%86%CC%83n/dify_knowledge_base.md):** Toàn bộ hồ sơ doanh nghiệp, sản phẩm tour 5N4Đ, lịch trình chi tiết, bảng giá, thực đơn, khách sạn, hàng không, chính sách hoàn hủy, bảo hiểm.
2. **[dify_qa_dataset.csv](file:///Users/tranngan/Desktop/Tour%20%C4%90A%CC%80%20Na%CC%86%CC%83n/dify_qa_dataset.csv):** Bộ dữ liệu 25+ cặp Hỏi - Đáp (Question - Answer) chuyên sâu về mọi khía cạnh của tour.
3. **[dify_system_prompt.md](file:///Users/tranngan/Desktop/Tour%20%C4%90A%CC%80%20Na%CC%86%CC%83n/dify_system_prompt.md):** Kịch bản System Prompt chuẩn 4 sao điều hành AI Chatbot, kèm các kịch bản mẫu (Few-shot) và công thức tính giá tự động.

---

## 🛠️ CÁC BƯỚC THIẾT LẬP TRÊN DIFY (CHỈ MẤT 3 - 5 PHÚT):

### BƯỚC 1: TẠO KNOWLEDGE BASE (KHO TRI THỨC) TRÊN DIFY
1. Đăng nhập vào nền tảng [Dify.ai](https://cloud.dify.ai/) (hoặc phiên bản Dify tự host của bạn).
2. Trên thanh menu trên cùng, bấm chọn **Knowledge** (Kho tri thức).
3. Bấm nút **Create Knowledge** (Tạo kho tri thức) $\to$ chọn **Import from file**.
4. Kéo thả một trong hai tệp (hoặc cả hai):
   - **Cách 1 (Khuyên dùng - Độ chính xác cao nhất):** Tải lên tệp `dify_qa_dataset.csv`. Tại bước chọn phân đoạn (Segmentation), chọn chế độ **Q&A Mode** (Dify sẽ tự động nhận diện 2 cột `Question` và `Answer`).
   - **Cách 2:** Tải lên tệp `dify_knowledge_base.md`. Chọn chế độ **Automatic** (Tự động) hoặc phân đoạn theo đề mục Markdown (`###`).
5. Chọn mô hình nhúng (Embedding Model): Khuyên dùng `text-embedding-3-small` (OpenAI), `bge-large-vi` hoặc mô hình mặc định của Dify.
6. Bấm **Save & Process** (Lưu và xử lý). Dify sẽ vector hóa toàn bộ dữ liệu trong khoảng 10 - 20 giây.

---

### BƯỚC 2: TẠO ỨNG DỤNG AI CHATBOT (APP)
1. Trên menu trên cùng, chuyển sang tab **Studio** (hoặc **Explore**).
2. Bấm nút **Create from Blank** (Tạo từ bản trắng).
3. Thiết lập thông tin App:
   - **Loại ứng dụng:** Chọn **Chatbot** (hoặc **Agent**).
   - **Tên ứng dụng:** `Heritage Tour Concierge 24/7`
   - **Icon:** Chọn biểu tượng lâu đài hoặc máy bay du lịch.
   - **Mô tả:** Trợ lý tư vấn tour du lịch di sản miền Trung 4 sao chuẩn quốc tế.
4. Bấm **Create**.

---

### BƯỚC 3: CẤU HÌNH PROMPT & LIÊN KẾT KHO TRI THỨC
1. Tại mục **Instructions / System Prompt** (Khung bên trái):
   - Mở tệp [dify_system_prompt.md](file:///Users/tranngan/Desktop/Tour%20%C4%90A%CC%80%20Na%CC%86%CC%83n/dify_system_prompt.md).
   - Sao chép toàn bộ nội dung từ Mục 1 đến Mục 3 và dán vào ô **Instructions**.
2. Tại mục **Context (Ngữ cảnh)**:
   - Bấm nút **Add** (Thêm) $\to$ Chọn Kho tri thức **Heritage Tours** vừa tạo ở Bước 1.
   - Thiết lập Retrieval Mode: Chọn **Hybrid Search** (Tìm kiếm kết hợp từ khóa và ngữ nghĩa) và bật **Rerank** (nếu có) để câu trả lời chính xác nhất.
3. Tại mục **Model (Mô hình)** (Góc trên bên phải):
   - Chọn `gpt-4o-mini`, `gpt-4o`, `claude-3-5-sonnet`, hoặc `gemini-1.5-flash/pro`.
   - Temperature: Đặt `0.3` hoặc `0.4` (độ chính xác cao, bám sát dữ liệu tour, không bịa chuyện).
4. Thiết lập tính năng trải nghiệm (Features):
   - **Opening Statement (Lời chào mở đầu):** Bật lên và dán:
     > *"Dạ em chào Anh/Chị! Em là Heritage Tour Concierge – Trợ lý tư vấn của Heritage Tours Việt Nam. Em rất hân hạnh được đồng hành và giải đáp mọi thông tin về Tour Cánh Cung Di Sản Miền Trung 5N4Đ (Huế – Đà Nẵng – Hội An – Bà Nà Hills). Anh/Chị đang quan tâm đến lịch trình khởi hành hay bảng giá cho gia đình mình ạ?"*
   - **Suggested Questions (Câu hỏi gợi ý):**
     1. Giá tour trọn gói 5N4Đ bao nhiêu 1 người?
     2. Lịch trình chi tiết 5 ngày 4 đêm đi những đâu?
     3. Tour có phù hợp cho người lớn tuổi và trẻ nhỏ không?
     4. Giá đã gồm vé cáp treo và buffet Bà Nà chưa?

---

### BƯỚC 4: KIỂM THỬ & XUẤT BẢN (PUBLISH)
1. Thử nhắn tin vào ô trò chuyện bên phải (Preview) với các câu hỏi:
   - *"Nhà mình có 2 người lớn và 1 bé 6 tuổi, tính giá giúp mình"*
   - *"Khách sạn trong tour là khách sạn nào?"*
   - *"Chuyển tiền cọc vào tài khoản nào?"*
2. Quan sát AI trích xuất thông tin chính xác từ Knowledge Base.
3. Bấm nút **Publish** (Xuất bản) $\to$ chọn **Update**.

---

### BƯỚC 5: NHÚNG CHATBOT VÀO WEBSITE HOẶC CHIA SẺ
Sau khi xuất bản, Dify cung cấp cho bạn:
- **Shareable Link (Đường dẫn công khai):** Link dạng `https://udify.app/chat/xxxx` gửi trực tiếp cho khách hàng hoặc nhân viên tư vấn dùng thử.
- **Embedded Widget (Mã nhúng web):** Đoạn mã `<script>` để dán trực tiếp vào góc dưới website [index.html](file:///Users/tranngan/Desktop/Tour%20%C4%90A%CC%80%20Na%CC%86%CC%83n/index.html) thay thế cho popup chat thông thường.
