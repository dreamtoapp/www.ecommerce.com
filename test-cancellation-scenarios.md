# 🧪 Customer Order Cancellation - Test Scenarios

## 📋 Test Data Setup

### **Scenario 1: Fresh Order (Can Cancel)**
- **Action:** Create a new order
- **Expected:** Cancel button visible with full time remaining
- **Test:** Should be able to cancel successfully

### **Scenario 2: Recent Order (Can Cancel)**
- **Action:** Order created 30 minutes ago
- **Expected:** Cancel button visible with ~30 minutes remaining
- **Test:** Should be able to cancel successfully

### **Scenario 3: Expired Order (Cannot Cancel)**
- **Action:** Order created 2 hours ago
- **Expected:** No cancel button visible
- **Test:** Should not be able to cancel

### **Scenario 4: Non-PENDING Order (Cannot Cancel)**
- **Action:** Order with status ASSIGNED, IN_TRANSIT, or DELIVERED
- **Expected:** No cancel button visible
- **Test:** Should not be able to cancel

---

## 🎯 Manual Testing Steps

### **Test 1: Fresh Order Cancellation**
1. **Create Order:**
   - Go to `http://localhost:3000`
   - Login as customer
   - Add items to cart
   - Complete checkout
   - Note order number

2. **Test Cancellation:**
   - Go to `http://localhost:3000/user/order-tracking`
   - Look for cancel button next to PENDING order
   - Click cancel button
   - Enter reason: "تغيير في الخطط"
   - Click "تأكيد الإلغاء"
   - Verify order status changes to "ملغي"

### **Test 2: Time Limit Validation**
1. **Create Order and Wait:**
   - Create new order
   - Note creation time
   - Wait 1 hour (or modify database timestamp for testing)

2. **Test Expired Order:**
   - Go to order tracking page
   - Verify cancel button is not visible
   - Try to access cancellation directly (should fail)

### **Test 3: Status Validation**
1. **Create Order and Change Status:**
   - Create new order
   - Manually change status in database to ASSIGNED
   - Refresh order tracking page
   - Verify cancel button is not visible

### **Test 4: Form Validation**
1. **Test Empty Reason:**
   - Click cancel button
   - Leave reason empty
   - Try to submit
   - Should show validation error

2. **Test Long Reason:**
   - Enter reason longer than 500 characters
   - Should show validation error

### **Test 5: Security Testing**
1. **Test Unauthorized Access:**
   - Try to cancel without login
   - Should redirect to login

2. **Test Wrong User:**
   - Login as different user
   - Try to cancel another user's order
   - Should show "order not found" error

---

## 🔧 Database Testing (Advanced)

### **Modify Order Timestamps for Testing**

If you want to test time limits without waiting, you can modify the database:

```javascript
// In MongoDB Compass or shell
db.Order.updateOne(
  { orderNumber: "YOUR_ORDER_NUMBER" },
  { 
    $set: { 
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    } 
  }
)
```

### **Change Order Status for Testing**

```javascript
// Test different statuses
db.Order.updateOne(
  { orderNumber: "YOUR_ORDER_NUMBER" },
  { $set: { status: "ASSIGNED" } }
)
```

---

## 📱 Mobile Testing

### **Test on Different Devices:**
1. **Mobile Phone:** Test on actual mobile device
2. **Tablet:** Test on tablet device
3. **Desktop:** Test on desktop browser
4. **Different Browsers:** Chrome, Safari, Firefox, Edge

### **Mobile-Specific Tests:**
1. **Touch Interaction:** Verify cancel button is touch-friendly
2. **Dialog Responsiveness:** Check dialog fits mobile screen
3. **Keyboard Input:** Test Arabic text input on mobile
4. **Orientation:** Test portrait and landscape modes

---

## 🌐 RTL Testing

### **Arabic Text Testing:**
1. **Reason Input:** Enter Arabic text in reason field
2. **Error Messages:** Verify Arabic error messages display correctly
3. **Time Display:** Check Arabic time formatting
4. **Button Text:** Verify Arabic button labels

### **Layout Testing:**
1. **Text Direction:** Verify RTL layout is correct
2. **Icon Positioning:** Check icons are on correct side
3. **Spacing:** Verify proper spacing in RTL mode

---

## ⚡ Performance Testing

### **Load Testing:**
1. **Multiple Orders:** Create 10+ orders and test page load
2. **Time Updates:** Verify time updates don't cause performance issues
3. **Dialog Performance:** Test dialog opening/closing performance

### **Network Testing:**
1. **Slow Network:** Test on slow network connection
2. **Offline Mode:** Test behavior when network is down
3. **Error Handling:** Test server error scenarios

---

## 🐛 Debugging Tips

### **Check Browser Console:**
- Look for JavaScript errors
- Check network requests
- Verify time calculations

### **Check Server Logs:**
- Monitor server-side validation
- Check database operations
- Verify authentication

### **Common Issues:**
1. **Time Zone Issues:** Ensure server and client use same timezone
2. **Authentication Issues:** Check session management
3. **Database Issues:** Verify order ownership and status

---

## 📊 Expected Results

### **Successful Cancellation:**
- ✅ Order status changes to "ملغي"
- ✅ Cancel button disappears
- ✅ Success message displayed
- ✅ Page refreshes automatically
- ✅ Reason saved in database

### **Failed Cancellation:**
- ❌ Error message displayed
- ❌ Order status unchanged
- ❌ Cancel button remains (if still eligible)
- ❌ Form validation errors shown

---

## 🎯 Test Checklist

- [ ] Fresh order can be canceled
- [ ] Expired order cannot be canceled
- [ ] Non-PENDING order cannot be canceled
- [ ] Empty reason shows validation error
- [ ] Long reason shows validation error
- [ ] Unauthorized access is blocked
- [ ] Wrong user access is blocked
- [ ] Mobile responsiveness works
- [ ] RTL layout is correct
- [ ] Arabic text input works
- [ ] Time updates correctly
- [ ] Success/error messages display
- [ ] Page refreshes after cancellation
- [ ] Database updates correctly

---

## 🚀 Quick Test Commands

```bash
# Start development server
pnpm dev

# Build for production testing
pnpm build

# Run type checking
pnpm type-check

# Check for linting issues
pnpm lint
```

---

**Happy Testing! 🎉** 