<?php

/* modules/tagadelic/templates/tagadelic-taxonomy-cloud.html.twig */
class __TwigTemplate_331a80bc372597d0fdd061d89aa9b41a5ead8ecdee84323bfc38f5b6f3711c11 extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = array(
        );
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        $tags = array("for" => 13);
        $filters = array();
        $functions = array("path" => 15);

        try {
            $this->env->getExtension('sandbox')->checkSecurity(
                array('for'),
                array(),
                array('path')
            );
        } catch (Twig_Sandbox_SecurityError $e) {
            $e->setTemplateFile($this->getTemplateName());

            if ($e instanceof Twig_Sandbox_SecurityNotAllowedTagError && isset($tags[$e->getTagName()])) {
                $e->setTemplateLine($tags[$e->getTagName()]);
            } elseif ($e instanceof Twig_Sandbox_SecurityNotAllowedFilterError && isset($filters[$e->getFilterName()])) {
                $e->setTemplateLine($filters[$e->getFilterName()]);
            } elseif ($e instanceof Twig_Sandbox_SecurityNotAllowedFunctionError && isset($functions[$e->getFunctionName()])) {
                $e->setTemplateLine($functions[$e->getFunctionName()]);
            }

            throw $e;
        }

        // line 12
        echo "<ul class=\"tag-cloud\">
  ";
        // line 13
        $context['_parent'] = $context;
        $context['_seq'] = twig_ensure_traversable((isset($context["tags"]) ? $context["tags"] : null));
        foreach ($context['_seq'] as $context["_key"] => $context["tag"]) {
            // line 14
            echo "  <li class=\"level";
            echo $this->env->getExtension('sandbox')->ensureToStringAllowed($this->env->getExtension('drupal_core')->escapeFilter($this->env, $this->getAttribute($context["tag"], "getWeight", array()), "html", null, true));
            echo "\">
    <a href=\"";
            // line 15
            echo $this->env->getExtension('sandbox')->ensureToStringAllowed($this->env->getExtension('drupal_core')->escapeFilter($this->env, $this->env->getExtension('drupal_core')->getPath("entity.taxonomy_term.canonical", array("taxonomy_term" => $this->getAttribute($context["tag"], "getId", array()))), "html", null, true));
            echo "\">";
            echo $this->env->getExtension('sandbox')->ensureToStringAllowed($this->env->getExtension('drupal_core')->escapeFilter($this->env, $this->getAttribute($context["tag"], "getName", array()), "html", null, true));
            echo "</a>
  </li>
  ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['tag'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 18
        echo "</ul>
";
    }

    public function getTemplateName()
    {
        return "modules/tagadelic/templates/tagadelic-taxonomy-cloud.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  66 => 18,  55 => 15,  50 => 14,  46 => 13,  43 => 12,);
    }

    public function getSource()
    {
        return "{#
/**
 * @file
 * Theme for Tagadelic module's tag cloud.
 *
 * Available variables:
 * - tags: the tags to be displayed in the cloud
 *
 * @ingroup themeable
 */
#}
<ul class=\"tag-cloud\">
  {% for tag in tags %}
  <li class=\"level{{ tag.getWeight }}\">
    <a href=\"{{ path('entity.taxonomy_term.canonical', {'taxonomy_term': tag.getId}) }}\">{{ tag.getName }}</a>
  </li>
  {% endfor %}
</ul>
";
    }
}
