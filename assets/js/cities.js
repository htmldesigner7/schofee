/* schofee — searchable city dropdown for inputs marked [data-city-select] */
(function () {
  var CITIES = [
    'Agartala', 'Agra', 'Ahmedabad', 'Ahmednagar', 'Aizawl', 'Ajmer', 'Akola', 'Alappuzha', 'Aligarh', 'Allahabad (Prayagraj)',
    'Alwar', 'Ambala', 'Ambarnath', 'Amravati', 'Amreli', 'Amritsar', 'Anand', 'Anantapur', 'Ankleshwar', 'Arrah',
    'Asansol', 'Aurangabad', 'Ayodhya', 'Azamgarh', 'Bagalkot', 'Bahadurgarh', 'Baharampur', 'Bahraich', 'Balasore', 'Ballari (Bellary)',
    'Ballia', 'Bally', 'Banda', 'Bankura', 'Bardhaman', 'Bareilly', 'Barasat', 'Baroda (Vadodara)', 'Barrackpore', 'Basirhat',
    'Bathinda', 'Beed', 'Begusarai', 'Belagavi (Belgaum)', 'Bengaluru', 'Berhampur', 'Bettiah', 'Bhagalpur', 'Bharuch', 'Bhatpara',
    'Bhavnagar', 'Bhilai', 'Bhilwara', 'Bhind', 'Bhiwadi', 'Bhiwani', 'Bhopal', 'Bhubaneswar', 'Bhuj', 'Bidar',
    'Bijapur (Vijayapura)', 'Bijnor', 'Bikaner', 'Bilaspur', 'Bokaro Steel City', 'Botad', 'Bulandshahr', 'Buxar', 'Chandigarh', 'Chandrapur',
    'Chennai', 'Chhapra', 'Chhindwara', 'Chikkamagaluru', 'Chittoor', 'Chittorgarh', 'Churu', 'Coimbatore', 'Cuddalore', 'Cuttack',
    'Dahod', 'Daman', 'Darbhanga', 'Davanagere', 'Dehradun', 'Delhi', 'Deoghar', 'Dewas', 'Dhanbad', 'Dharamshala',
    'Dharwad', 'Dhule', 'Dibrugarh', 'Dimapur', 'Dindigul', 'Durg', 'Durgapur', 'Eluru', 'Erode', 'Etawah',
    'Faridabad', 'Faridkot', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Gandhidham', 'Gandhinagar', 'Gangtok', 'Gaya', 'Ghaziabad',
    'Godhra', 'Gonda', 'Gondia', 'Gorakhpur', 'Gulbarga (Kalaburagi)', 'Guntur', 'Gurugram', 'Guwahati', 'Gwalior', 'Hajipur',
    'Haldwani', 'Hapur', 'Haridwar', 'Hassan', 'Hazaribagh', 'Himmatnagar', 'Hisar', 'Hosur', 'Hoshiarpur', 'Howrah',
    'Hubballi', 'Hyderabad', 'Ichalkaranji', 'Imphal', 'Indore', 'Itanagar', 'Jabalpur', 'Jagdalpur', 'Jaipur', 'Jalandhar',
    'Jalgaon', 'Jalna', 'Jamalpur', 'Jammu', 'Jamnagar', 'Jamshedpur', 'Jaunpur', 'Jetpur', 'Jhansi', 'Jhunjhunu',
    'Jodhpur', 'Junagadh', 'Kadapa', 'Kakinada', 'Kalyan-Dombivli', 'Kamarhati', 'Kanchipuram', 'Kannur', 'Kanpur', 'Karaikudi',
    'Karimnagar', 'Karnal', 'Karur', 'Katihar', 'Kavali', 'Khammam', 'Khandwa', 'Kharagpur', 'Khora', 'Kishanganj',
    'Kochi', 'Kolar', 'Kolhapur', 'Kolkata', 'Kollam', 'Korba', 'Kota', 'Kottayam', 'Kozhikode', 'Kumbakonam',
    'Kurnool', 'Kurukshetra', 'Latur', 'Lucknow', 'Ludhiana', 'Madurai', 'Mahbubnagar', 'Mahesana', 'Maheshtala', 'Malda',
    'Malegaon', 'Mandi', 'Mandsaur', 'Mangaluru', 'Mathura', 'Mau', 'Meerut', 'Mira-Bhayandar', 'Mirzapur', 'Moga',
    'Moradabad', 'Morbi', 'Morena', 'Motihari', 'Mumbai', 'Munger', 'Muzaffarnagar', 'Muzaffarpur', 'Mysuru', 'Nadiad',
    'Nagaon', 'Nagercoil', 'Nagpur', 'Naihati', 'Nalgonda', 'Namakkal', 'Nanded', 'Nandurbar', 'Narasaraopet', 'Navi Mumbai',
    'Navsari', 'Nellore', 'New Delhi', 'Nizamabad', 'Noida', 'Ongole', 'Orai', 'Osmanabad', 'Palakkad', 'Palanpur',
    'Pali', 'Palghar', 'Panaji', 'Panchkula', 'Panipat', 'Parbhani', 'Patan', 'Pathankot', 'Patiala', 'Patna',
    'Pimpri-Chinchwad', 'Pondicherry (Puducherry)', 'Porbandar', 'Port Blair', 'Pudukkottai', 'Pune', 'Puri', 'Purnia', 'Raebareli', 'Raichur',
    'Raigarh', 'Raipur', 'Rajahmundry', 'Rajkot', 'Rajnandgaon', 'Rampur', 'Ranchi', 'Ratlam', 'Ratnagiri', 'Rewa',
    'Rewari', 'Rohtak', 'Roorkee', 'Rourkela', 'Sagar', 'Saharanpur', 'Salem', 'Sambalpur', 'Sangli', 'Sasaram',
    'Satara', 'Satna', 'Secunderabad', 'Shahjahanpur', 'Shillong', 'Shimla', 'Shivamogga', 'Sikar', 'Silchar', 'Siliguri',
    'Silvassa', 'Sirsa', 'Sitapur', 'Solapur', 'Sonipat', 'Sri Ganganagar', 'Srinagar', 'Surat', 'Surendranagar', 'Tezpur',
    'Thane', 'Thanjavur', 'Thiruvananthapuram', 'Thoothukudi', 'Thrissur', 'Tinsukia', 'Tiruchirappalli', 'Tirunelveli', 'Tirupati', 'Tiruppur',
    'Tiruvannamalai', 'Tumakuru', 'Udaipur', 'Udupi', 'Ujjain', 'Ulhasnagar', 'Unnao', 'Vadodara', 'Valsad', 'Vapi',
    'Varanasi', 'Vasai-Virar', 'Vellore', 'Veraval', 'Vidisha', 'Vijayawada', 'Viluppuram', 'Visakhapatnam', 'Vizianagaram', 'Warangal',
    'Wardha', 'Yamunanagar', 'Yavatmal'
  ];
  CITIES.sort(function (a, b) { return a.localeCompare(b); });

  var uid = 0;
  [].slice.call(document.querySelectorAll('input[data-city-select]')).forEach(function (input) {
    var id = 'city-list-' + (++uid);
    var wrap = document.createElement('div'); wrap.className = 'combo';
    var list = document.createElement('ul'); list.className = 'combo__list'; list.id = id; list.setAttribute('role', 'listbox'); list.hidden = true;
    var chev = document.createElement('span'); chev.className = 'combo__chev'; chev.setAttribute('aria-hidden', 'true');
    chev.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    input.parentNode.insertBefore(wrap, input);
    wrap.appendChild(input); wrap.appendChild(chev); wrap.appendChild(list);
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-controls', id);
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('autocomplete', 'off');
    if (!input.placeholder) input.placeholder = 'Select or search your city';

    var items = [], active = -1;
    var setActive = function (i) {
      if (items[active]) items[active].setAttribute('aria-selected', 'false');
      active = i;
      if (items[active]) { items[active].setAttribute('aria-selected', 'true'); items[active].scrollIntoView({ block: 'nearest' }); }
    };
    var close = function () { list.hidden = true; input.setAttribute('aria-expanded', 'false'); active = -1; };
    var pick = function (name) {
      input.value = name;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      close();
    };
    var render = function () {
      var q = input.value.trim().toLowerCase();
      var starts = [], has = [];
      CITIES.forEach(function (c) {
        var l = c.toLowerCase();
        if (!q || l.indexOf(q) === 0) starts.push(c); else if (l.indexOf(q) > -1) has.push(c);
      });
      var found = starts.concat(has);
      list.innerHTML = ''; items = []; active = -1;
      if (!found.length) {
        var empty = document.createElement('li'); empty.className = 'combo__empty';
        empty.textContent = 'No match. Your typed city will be used.'; list.appendChild(empty);
      }
      found.forEach(function (c) {
        var li = document.createElement('li'); li.setAttribute('role', 'option'); li.textContent = c;
        li.addEventListener('mousedown', function (e) { e.preventDefault(); pick(c); });
        list.appendChild(li); items.push(li);
      });
      list.hidden = false; input.setAttribute('aria-expanded', 'true');
    };

    input.addEventListener('focus', render);
    input.addEventListener('click', function () { if (list.hidden) render(); });
    input.addEventListener('input', render);
    input.addEventListener('blur', close);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); if (list.hidden) render(); setActive(Math.min(active + 1, items.length - 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(Math.max(active - 1, 0)); }
      else if (e.key === 'Enter' && !list.hidden && items[active]) { e.preventDefault(); pick(items[active].textContent); }
      else if (e.key === 'Escape' && !list.hidden) { e.stopPropagation(); e.preventDefault(); close(); }
      else if (e.key === 'Tab') close();
    });
    chev.addEventListener('mousedown', function (e) { e.preventDefault(); if (list.hidden) { input.focus(); render(); } else close(); });
  });
})();
