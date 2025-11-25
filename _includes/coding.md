<h2 class="section-title">Coding</h2>

{% assign excluded = site.exclude_repos | default: '' %}
{% assign repo_data = site.data.repo_data | default: {} %}

<div class="publications">
<ol class="bibliography">

{% for entry in site.data.coding_repos %}
  {% assign repo_meta = site.github.public_repositories | where: "name", entry.name | first %}
  {% assign data = repo_data[entry.name] %}
  {% assign archive_flag = repo_meta.archived | default: false %}
  {% unless excluded contains entry.name or archive_flag %}
  <li>
  <div class="pub-row repo-card">

    <div class="col-sm-3 abbr" style="position: relative;padding-right: 15px;padding-left: 15px;">
      {% assign image_src = data.image | default: repo_meta.open_graph_image_url %}
      {% if image_src %}
        <img src="{{ image_src }}" alt="{{ entry.name }} preview" class="teaser img-fluid z-depth-1">
      {% else %}
        <div class="teaser repo-tile" style="background: {{ entry.fallback_gradient | default: 'linear-gradient(135deg, #2f5ae8, #6ac8ff)' }};">{{ entry.name }}</div>
      {% endif %}
      <abbr class="badge">{{ entry.badge | default: repo_meta.language | default: 'Code' }}</abbr>
    </div>

    <div class="col-sm-9" style="position: relative;padding-right: 15px;padding-left: 20px;">
      {% assign repo_url = repo_meta.html_url | default: site.github.owner_url | append: '/' | append: entry.name %}
      <div class="title"><a href="{{ repo_url }}">{{ entry.name }}</a></div>
      <div class="repo-summary">{{ entry.summary | default: repo_meta.description }}</div>
      {% assign updated_at = data.pushed_at | default: repo_meta.pushed_at | default: repo_meta.updated_at %}
      {% assign license = repo_meta.license.spdx_id | default: repo_meta.license.key | default: "License not specified" %}
      <div class="repo-meta"><strong>License:</strong> {{ license }}<br><em>Updated {{ updated_at | date: "%b %-d, %Y" }}</em></div>
      <div class="links">
        <a href="{{ repo_url }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">Repository</a>
        {% if repo_meta.homepage and repo_meta.homepage != "" %}
        <a href="{{ repo_meta.homepage }}" class="btn btn-sm z-depth-0" role="button" target="_blank" style="font-size:12px;">Demo</a>
        {% endif %}
      </div>
    </div>
  </div>
  </li>
  {% endunless %}
{% endfor %}

</ol>
</div>
